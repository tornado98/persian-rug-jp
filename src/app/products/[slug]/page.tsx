// src/app/products/[slug]/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { Product } from "@prisma/client";
import ProductDetailClient from "@/components/product/ProductDetailClient";
import ProductCard from "@/components/ProductCard";

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  // Guard against empty or undefined slug
  if (!params?.slug) {
    notFound();
  }

  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
  });

  if (!product) {
    notFound();
  }

  // Convert to tatami
  const areaCm2 = product.sizeWidth * product.sizeHeight;
  const tatamiApprox = (areaCm2 / (180 * 90)).toFixed(1);

  // Fetch related products (same origin or design, excluding current)
  const relatedProducts: Product[] = await prisma.product.findMany({
    where: {
      inStock: true,
      id: { not: product.id },
      OR: [{ origin: product.origin }, { design: { hasSome: product.design } }],
    },
    take: 4,
  });

  return (
    <main className="max-w-7xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <nav className="text-sm text-primary-500 mb-6">
        <a href="/" className="hover:text-primary-700">
          ホーム
        </a>{" "}
        /
        <a href="/products" className="hover:text-primary-700">
          {" "}
          商品一覧
        </a>{" "}
        /<span className="text-primary-800 font-medium"> {product.title}</span>
      </nav>

      {/* Product details */}
      <ProductDetailClient
        product={{
          ...product,
          tatamiApprox,
        }}
      />

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-20">
          <h2 className="text-2xl md:text-3xl font-bold text-primary-800 mb-6">
            あなたにおすすめの絨毯
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rp) => (
              <ProductCard key={rp.id} product={rp} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
