// app/api/security-logs/route.ts
import { NextRequest, NextResponse } from "next/server";
import { adminAccessError } from "@/lib/admin-access"; // NextAuth v5 — auth() вместо getServerSession

// ── Лог-хранилище (in-memory) ─────────────────────────────────
import { logBuffer, getTopIps, appendSecurityLog } from '@/lib/security-logs';

// ── Проверка: только ADMIN ─────────────────────────────────────
async function requireAdmin() {
  return (await adminAccessError()) === null;
}

// ── GET /api/security-logs ────────────────────────────────────
export async function GET(request: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = request.nextUrl;
  const level = searchParams.get("level");
  const limit = Math.min(parseInt(searchParams.get("limit") || "100"), 500);
  const page  = Math.max(parseInt(searchParams.get("page")  || "1"),   1);
  const ip    = searchParams.get("ip");

  let logs = [...logBuffer];
  if (level) logs = logs.filter((l) => l.level === level.toUpperCase());
  if (ip)    logs = logs.filter((l) => l.ip === ip);

  const total    = logs.length;
  const start    = (page - 1) * limit;
  const paginated = logs.slice(start, start + limit);

  const stats = {
    total:    logBuffer.length,
    security: logBuffer.filter((l) => l.level === "SECURITY").length,
    errors:   logBuffer.filter((l) => l.level === "ERROR").length,
    warns:    logBuffer.filter((l) => l.level === "WARN").length,
    topIps:   getTopIps(5),
  };

  return NextResponse.json({
    logs: paginated,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    stats,
  });
}

// ── POST /api/security-logs — внутренний лог ─────────────────
export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-internal-secret");
  if (!secret || secret !== process.env.INTERNAL_LOG_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    appendSecurityLog(body);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
}

// ── DELETE /api/security-logs — очистка ──────────────────────
export async function DELETE() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  logBuffer.length = 0;
  return NextResponse.json({ ok: true });
}
