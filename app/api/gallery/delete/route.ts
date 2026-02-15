import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { id } = await req.json();

  const item = await prisma.gallery.findUnique({ where: { id } });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await cloudinary.uploader.destroy(item.publicId);
  await prisma.gallery.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
