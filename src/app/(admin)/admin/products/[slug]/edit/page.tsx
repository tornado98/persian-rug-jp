// src/app/(admin)/admin/products/[slug]/edit/page.tsx
import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";
import { notFound } from "next/navigation";

export default async function EditProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
  });
  if (!product) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-primary-900">Edit Product</h1>
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
