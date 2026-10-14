import { auth } from '@/auth';
import { validBookingDay, availableBookingSlot } from '@/lib/booking-rules';
import { withRateLimit, LIMITS } from '@/lib/rate-limiter';
import { Prisma } from '@prisma/client';
// app/api/bookings/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendNewBookingEmails, formatBookingDate } from "@/lib/booking-mail";
import { createLogger } from "@/lib/logger";
import { z } from "zod";

const logger = createLogger("bookings");

// ✅ FIX: Zod-схема для валидации
const bookingSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  phone: z.string().min(7).max(20),
  email: z.string().trim().email().max(254).toLowerCase(),
  serviceName: z.string().min(1).max(200),
  date: z.string().refine(validBookingDay, { message: "Use a valid YYYY-MM-DD calendar date" }),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Time must be HH:MM"),
  comment: z.string().max(1000).optional(),
});

// GET /api/bookings?date=2025-05-12
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");

  if (!date || !validBookingDay(date)) {
    return NextResponse.json({ error: "Valid date required" }, { status: 400 });
  }

  try {
    const bookings = await prisma.booking.findMany({
      where: {
        date: new Date(date),
        status: { not: "cancelled" },
      },
      select: { time: true },
    });

    return NextResponse.json({ bookedSlots: bookings.map((b) => b.time) });
  } catch (err) {
    logger.error(err, "Failed to fetch bookings");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const limited = await withRateLimit(req, LIMITS.booking);
  if (limited) return limited;
  // ✅ FIX: валидация входных данных
  let data: z.infer<typeof bookingSchema>;
  try {
    data = bookingSchema.parse(await req.json());
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input", details: err.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  const { firstName, lastName, phone, email, serviceName, date, time, comment } = data;

  if (!availableBookingSlot(date, time)) return NextResponse.json({ error: 'Invalid or past slot' }, { status: 400 });

  try {
    const existing = await prisma.booking.findFirst({
      where: {
        date: new Date(date),
        time,
        status: { not: "cancelled" },
      },
    });

    if (existing) {
      return NextResponse.json({ error: "slot_taken" }, { status: 409 });
    }

    const session = await auth();
    const account = session?.user?.id ? await prisma.user.findUnique({ where: { id: session.user.id }, select: { id: true, email: true, emailVerified: true } }) : null;
    const booking = await prisma.booking.create({
      data: {
        userId: account?.emailVerified && account.email === email ? account.id : null,
        firstName, lastName, phone, email, serviceName,
        date: new Date(date), time, comment, status: "pending",
      },
    });

    const service = await prisma.service.findFirst({
      where: { title: serviceName },
    });

    // ✅ FIX: logger вместо console.log
    try {
      await sendNewBookingEmails({
        firstName, lastName, phone, email, serviceName,
        servicePrice: service?.price ?? undefined,
        date: formatBookingDate(booking.date),
        time,
        comment: comment || undefined,
      });
      logger.info({ bookingId: booking.id }, "Booking emails sent");
    } catch (err) {
      logger.error(err, "Failed to send booking emails");
      // Не возвращаем ошибку — букинг создан успешно, письмо второстепенно
    }

    return NextResponse.json({ success: true, booking: { id: booking.id, date: booking.date, time: booking.time, status: booking.status } }, { status: 201 });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      return NextResponse.json({ error: 'slot_taken' }, { status: 409 });
    }
    logger.error(err, "Failed to create booking");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}