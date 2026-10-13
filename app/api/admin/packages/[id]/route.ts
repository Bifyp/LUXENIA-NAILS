import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { adminAccessError } from '@/lib/admin-access';
import { prisma } from '@/lib/prisma';
import { editablePackageSchema } from '@/lib/content-validations';
type Context = { params: Promise<{ id: string }> };
export async function PATCH(req: NextRequest, { params }: Context) {
  const accessError = await adminAccessError();
  if (accessError) return accessError;
  const parsed = editablePackageSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Invalid package' }, { status: 400 });
  const { id } = await params;
  const { benefits, ...data } = parsed.data;
  try {
    const pkg = await prisma.package.update({ where: { id }, data: { ...data, benefits: { deleteMany: {}, create: benefits.filter(Boolean).map((text) => ({ text })) } }, include: { benefits: true } });
    return NextResponse.json({ success: true, package: pkg });
  } catch (err) {
    return NextResponse.json({ error: 'Update failed' }, { status: err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025' ? 404 : 500 });
  }
}
export async function DELETE(_req: NextRequest, { params }: Context) {
  const accessError = await adminAccessError();
  if (accessError) return accessError;
  const { id } = await params;
  try { await prisma.package.delete({ where: { id } }); return NextResponse.json({ success: true }); }
  catch (err) { return NextResponse.json({ error: 'Delete failed' }, { status: err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025' ? 404 : 500 }); }
}
