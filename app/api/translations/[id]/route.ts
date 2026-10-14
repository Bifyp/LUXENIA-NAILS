import { adminAccessError } from '@/lib/admin-access';
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const accessError = await adminAccessError();
  if (accessError) return accessError;
  const { id } = await params;

  const data = await req.formData();

  await prisma.translation.update({
    where: { id },
    data: {
      key: data.get("key") as string,
      value: data.get("value") as string
    }
  });

  return NextResponse.redirect(new URL("/admin/translations", req.url), 303);
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const accessError = await adminAccessError();
  if (accessError) return accessError;
  const { id } = await params;

  await prisma.translation.delete({
    where: { id }
  });

  return NextResponse.json({ success: true });
}
