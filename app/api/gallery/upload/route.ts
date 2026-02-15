import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // ЖДЁМ Cloudinary
  const result: any = await new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder: "gallery" },
      (error, result) => {
        if (error || !result) reject(error);
        else resolve(result);
      }
    ).end(buffer);
  });

  // ЖДЁМ Prisma
  const item = await prisma.gallery.create({
    data: {
      url: result.secure_url,
      publicId: result.public_id,
    },
  });

  return NextResponse.json(item);
}
