// src/app/api/admin/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const product = await prisma.product.create({
    data: {
      title: body.title,
      slug: body.slug,
      description: body.description,
      price: body.price,
      images: body.images,
      sizeWidth: body.sizeWidth,
      sizeHeight: body.sizeHeight,
      origin: body.origin,
      material: body.material,
      colorMain: body.colorMain,
      design: body.design,
      inStock: body.inStock,
    },
  });
  return NextResponse.json(product);
}
