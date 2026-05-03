// src/app/api/admin/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  // Only admin users can create products
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    // Trim string fields to avoid accidental whitespace
    const title = typeof body.title === "string" ? body.title.trim() : "";
    const slug = typeof body.slug === "string" ? body.slug.trim() : "";
    const description =
      typeof body.description === "string" ? body.description.trim() : "";
    const price = Number(body.price);
    const origin = typeof body.origin === "string" ? body.origin.trim() : "";
    const material =
      typeof body.material === "string" ? body.material.trim() : "";
    const colorMain =
      typeof body.colorMain === "string" ? body.colorMain.trim() : "";
    const design = Array.isArray(body.design) ? body.design : [];
    const images = Array.isArray(body.images) ? body.images : [];
    const inStock = typeof body.inStock === "boolean" ? body.inStock : true;
    const sizeWidth = Number(body.sizeWidth) || 0;
    const sizeHeight = Number(body.sizeHeight) || 0;

    // --- Validation ---
    if (!title) {
      return NextResponse.json(
        { error: "Title is required." },
        { status: 400 },
      );
    }

    if (!slug) {
      return NextResponse.json({ error: "Slug is required." }, { status: 400 });
    }

    // Slug must only contain lowercase letters, numbers, and hyphens (URL-safe)
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      return NextResponse.json(
        {
          error:
            "Slug must contain only lowercase letters, numbers, and single hyphens (no spaces or special characters).",
        },
        { status: 400 },
      );
    }

    if (isNaN(price) || price < 0) {
      return NextResponse.json(
        { error: "Price must be a non-negative number." },
        { status: 400 },
      );
    }

    // Check if slug already exists
    const existingProduct = await prisma.product.findUnique({
      where: { slug },
    });
    if (existingProduct) {
      return NextResponse.json(
        { error: "A product with this slug already exists." },
        { status: 409 },
      );
    }

    // Create product
    const product = await prisma.product.create({
      data: {
        title,
        slug,
        description,
        price,
        images,
        sizeWidth,
        sizeHeight,
        origin,
        material,
        colorMain,
        design,
        inStock,
      },
    });

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error: any) {
    console.error("Create product error:", error);
    return NextResponse.json(
      {
        error: "Failed to create product.",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 },
    );
  }
}
