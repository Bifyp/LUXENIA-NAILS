import { POST as createBooking } from '@/app/api/bookings/route';
import { adminAccessError } from '@/lib/admin-access';
// app/api/admin/bookings/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendNewBookingEmails, formatBookingDate } from "@/lib/booking-mail";

export async function GET(req: NextRequest) {
  const accessError = await adminAccessError();
  if (accessError) return accessError;
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const limit = Math.min(500, Math.max(1, Number(searchParams.get('limit')) || 100))

    const bookings = await prisma.booking.findMany({
      where: status && status !== 'all' ? { status } : undefined,
      orderBy: { createdAt: 'desc' },
      take: limit,
    })

    const total     = await prisma.booking.count()
    const pending   = await prisma.booking.count({ where: { status: 'pending' } })
    const confirmed = await prisma.booking.count({ where: { status: 'confirmed' } })
    const cancelled = await prisma.booking.count({ where: { status: 'cancelled' } })
    const completed = await prisma.booking.count({ where: { status: 'completed' } })

    return NextResponse.json({ bookings, stats: { total, pending, confirmed, cancelled, completed } })
  } catch (error) {
    console.error('[GET /api/admin/bookings]', error)
    return NextResponse.json({ error: 'Помилка завантаження' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const accessError = await adminAccessError();
  if (accessError) return accessError;
  return createBooking(req);
}
