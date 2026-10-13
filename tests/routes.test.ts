import { beforeEach, afterAll, describe, it, expect, vi } from 'vitest';
import { NextRequest } from 'next/server';
const state = vi.hoisted(() => ({ session: null as null | { user: { id: string; role: string } } }));
vi.mock('@/auth', () => ({ auth: async () => state.session }));
vi.mock('@/lib/mail', () => ({ sendEmailCode: vi.fn(async () => undefined) }));
vi.mock('@/lib/booking-mail', () => ({ sendNewBookingEmails: vi.fn(async () => undefined), sendStatusChangeEmail: vi.fn(async () => undefined), formatBookingDate: (date: Date) => date.toISOString() }));
import { prisma } from '@/lib/prisma';
import { hash, compare } from 'bcryptjs';
import { digestCode } from '@/lib/email-codes';
import { POST as verify } from '@/app/api/verify-code/route';
import { POST as reset } from '@/app/api/auth/reset-password/route';
import { POST as register } from '@/app/api/register/route';
import { POST as legacyRegister } from '@/app/api/auth/register/route';
import { POST as book } from '@/app/api/bookings/route';
import { POST as legacyBook } from '@/app/api/bookings/check/route';
import { GET as adminBookings, POST as adminBook } from '@/app/api/admin/bookings/route';
import { PATCH as statusChange } from '@/app/api/admin/bookings/[id]/route';
import { POST as createService } from '@/app/api/admin/services/route';
import { POST as createPackage } from '@/app/api/admin/packages/route';
import { PATCH as updatePackage, DELETE as deletePackage } from '@/app/api/admin/packages/[id]/route';
import { PATCH as translations } from '@/app/api/translations/route';
import { POST as upload } from '@/app/api/admin/gallery/upload/route';
import { POST as createTemplate } from '@/app/api/admin/email-templates/route';
import { GET as getTemplates } from '@/app/api/admin/email-templates/route';
import { PATCH as updateProduct } from '@/app/api/admin/products/route';

function req(path: string, body: unknown = {}, ip = path) {
  return new NextRequest(`https://luxenia.example${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json', origin: 'https://luxenia.example', 'x-forwarded-for': ip }, body: JSON.stringify(body) });
}
const booking = { firstName: 'Test', lastName: 'Client', phone: '+48123456789', email: 'client@example.com', serviceName: 'Manicure', date: '2099-06-15', time: '11:00' };
beforeEach(async () => {
  state.session = null;
  process.env.TRUST_PROXY = '1';
  await prisma.booking.deleteMany(); await prisma.emailCode.deleteMany(); await prisma.user.deleteMany();
  await prisma.package.deleteMany();
});
afterAll(() => prisma.$disconnect());
async function code(email: string, purpose: string, expired = false) {
  await prisma.emailCode.create({ data: { email, purpose, code: digestCode(email, purpose as 'registration' | 'password-reset', '123456'), expiresAt: new Date(Date.now() + (expired ? -1000 : 600000)) } });
}

describe('server boundaries on an isolated migrated SQLite database', () => {
  it('rejects anonymous sensitive reads and all tested admin writes', async () => {
    const routes = [createService, createPackage, translations, upload, createTemplate, updateProduct, adminBook];
    for (const route of routes) expect((await route(req('/api/admin/test'))).status).toBe(401);
    expect((await adminBookings(req('/api/admin/bookings'))).status).toBe(401);
    expect((await getTemplates()).status).toBe(401);
  });
  it('rejects a stale admin JWT after database role demotion', async () => {
    const user = await prisma.user.create({ data: { email: 'demoted@example.com', role: 'user' } });
    state.session = { user: { id: user.id, role: 'admin' } };
    expect((await createService(req('/api/admin/services'))).status).toBe(403);
  });
  it('does not create an account through either registration entry point', async () => {
    const input = { email: 'signup@example.com', name: 'Test User', password: 'Test-pass-123' };
    expect((await register(req('/api/register', input))).status).toBe(200);
    expect((await legacyRegister(req('/api/auth/register', input))).status).toBe(200);
    expect(await prisma.user.count()).toBe(0);
    const record = await prisma.emailCode.findFirst();
    expect(record?.code).toHaveLength(64);
  });
  it('consumes registration code once and marks email verified', async () => {
    const email = 'verified@example.com'; await code(email, 'registration');
    const input = { email, code: '123456', name: 'Test User', password: 'Test-pass-123' };
    expect((await verify(req('/api/verify-code', input, 'verify-once'))).status).toBe(200);
    expect((await verify(req('/api/verify-code', input, 'verify-once'))).status).toBe(400);
    const user = await prisma.user.findUniqueOrThrow({ where: { email } });
    expect(user.emailVerified).not.toBeNull(); expect(await compare(input.password, user.password!)).toBe(true);
  });
  it('rejects expired codes', async () => {
    const email = 'expired@example.com'; await code(email, 'registration', true);
    expect((await verify(req('/api/verify-code', { email, code: '123456', name: 'Test User', password: 'Test-pass-123' }, 'expired'))).status).toBe(400);
    expect(await prisma.user.count()).toBe(0);
  });
  it('resets existing password without accepting registration codes', async () => {
    const email = 'reset@example.com'; await prisma.user.create({ data: { email, password: await hash('old-pass-123', 4) } });
    await code(email, 'registration');
    const input = { email, code: '123456', password: 'new-pass-123' };
    expect((await reset(req('/api/auth/reset-password', input, 'reset-one'))).status).toBe(400);
    await code(email, 'password-reset');
    expect((await reset(req('/api/auth/reset-password', input, 'reset-one'))).status).toBe(200);
    expect((await reset(req('/api/auth/reset-password', input, 'reset-one'))).status).toBe(400);
    const user = await prisma.user.findUniqueOrThrow({ where: { email } }); expect(await compare(input.password, user.password!)).toBe(true);
  });
  it('rejects malformed booking payloads through both routes', async () => {
    expect((await book(req('/api/bookings', {}, 'bad-one'))).status).toBe(400);
    expect((await legacyBook(req('/api/bookings/check', { ...booking, date: '2099-02-30' }, 'bad-two'))).status).toBe(400);
  });
  it('allows exactly one concurrent reservation for a slot', async () => {
    const responses = await Promise.all([book(req('/api/bookings', booking, 'book-one')), book(req('/api/bookings', booking, 'book-two'))]);
    expect(responses.map((r) => r.status).sort()).toEqual([201, 409]);
    expect(await prisma.booking.count()).toBe(1);
  });
  it('releases cancelled slots and rejects reactivation into an occupied slot', async () => {
    const old = await prisma.booking.create({ data: { ...booking, date: new Date(booking.date), status: 'cancelled' } });
    expect((await book(req('/api/bookings', booking, 'book-cancelled'))).status).toBe(201);
    const admin = await prisma.user.create({ data: { email: 'admin@example.com', role: 'admin' } }); state.session = { user: { id: admin.id, role: 'admin' } };
    expect((await statusChange(req('/api/admin/bookings/id', { status: 'confirmed' }), { params: Promise.resolve({ id: old.id }) })).status).toBe(409);
  });
  it('updates and deletes packages with their benefits', async () => {
    const admin = await prisma.user.create({ data: { email: 'package-admin@example.com', role: 'admin' } }); state.session = { user: { id: admin.id, role: 'admin' } };
    const input = { title: 'Package', sessions: '3', price: 100, oldPrice: 120, benefits: ['One'] };
    const created = await createPackage(req('/api/admin/packages', input)); const data = await created.json(); expect(created.status).toBe(200);
    const params = Promise.resolve({ id: data.package.id });
    expect((await updatePackage(req('/api/admin/packages/id', { ...input, benefits: ['Two', 'Three'] }), { params })).status).toBe(200);
    expect(await prisma.benefit.count({ where: { packageId: data.package.id } })).toBe(2);
    expect((await deletePackage(req('/api/admin/packages/id'), { params })).status).toBe(200);
    expect(await prisma.benefit.count({ where: { packageId: data.package.id } })).toBe(0);
  });
});

it('associates authenticated bookings only with the verified account email', async () => {
  const user = await prisma.user.create({ data: { email: booking.email, role: 'user', emailVerified: new Date() } });
  state.session = { user: { id: user.id, role: 'user' } };
  expect((await book(req('/api/bookings', booking, 'linked-booking'))).status).toBe(201);
  const saved = await prisma.booking.findFirstOrThrow();
  expect(saved.userId).toBe(user.id);
});
