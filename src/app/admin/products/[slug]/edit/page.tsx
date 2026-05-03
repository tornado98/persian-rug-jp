// src/app/admin/products/[slug]/edit/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import DeleteProductButton from "@/components/admin/DeleteProductButton";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function EditProductPage({
  params,
}: {
  params: { slug: string };
}) {
  // Guard against empty or missing slug
  if (!params?.slug || params.slug.trim() === "") {
    notFound();
  }

  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-8">
      {/* Header with back link, title and delete action */}
      <div>
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-800 transition-colors mb-4 text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary-900">
              Edit Product
            </h1>
            <p className="text-primary-600 mt-1">
              {product.title} — {product.inStock ? "In Stock" : "Out of Stock"}
            </p>
          </div>

          {/* Delete product button */}
          <DeleteProductButton slug={product.slug} title={product.title} />
        </div>
      </div>

      {/* Edit form */}
      <ProductForm
        initialData={{
          title: product.title,
          slug: product.slug,
          description: product.description,
          price: product.price,
          sizeWidth: product.sizeWidth,
          sizeHeight: product.sizeHeight,
          origin: product.origin,
          material: product.material,
          colorMain: product.colorMain,
          design: product.design,
          inStock: product.inStock,
          images: product.images,
        }}
      />
    </div>
  );
}
