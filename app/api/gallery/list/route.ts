import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const items = await prisma.gallery.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(items);
}
