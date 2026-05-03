// src/app/page.tsx
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import type { Product } from "@prisma/client";
import ProductCard from "@/components/ProductCard";

export default async function HomePage() {
  // Fetch featured products (latest 6 in stock)
  const featuredProducts: Product[] = await prisma.product.findMany({
    where: { inStock: true },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  return (
    <>
      {/* ========== HERO SECTION ========== */}
      <section className="relative w-full h-[70vh] min-h-[500px] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1600166898405-da9535204843?auto=format&fit=crop&w=1920&q=80"
          alt="Persian handwoven rug"
          fill
          className="object-cover brightness-[0.35]"
          priority
          unoptimized
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary-50 drop-shadow-lg animate-fade-in">
            手織りの芸術
          </h1>
          <p className="mt-4 text-lg md:text-2xl text-primary-100 max-w-2xl drop-shadow">
            イランから直輸入した最高級ペルシャ絨毯を、
            <br className="hidden sm:block" />
            あなたの暮らしに。
          </p>
          <Link
            href="#featured"
            className="mt-8 inline-block bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            コレクションを見る
          </Link>
        </div>
      </section>

      {/* ========== FEATURED PRODUCTS ========== */}
      <section id="featured" className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-primary-800 text-center mb-12 tracking-wide">
          おすすめ商品
        </h2>

        {featuredProducts.length === 0 ? (
          <p className="text-center text-primary-600">
            現在、商品はありません。
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link
            href="/products"
            className="inline-block border-2 border-primary-600 text-primary-700 hover:bg-primary-600 hover:text-white px-8 py-3 rounded-full font-medium transition-colors duration-300"
          >
            すべての商品を見る
          </Link>
        </div>
      </section>

      {/* ========== BRAND STORY ========== */}
      <section className="bg-primary-100 py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-800 mb-6">
            私たちの物語
          </h2>
          <p className="text-primary-700 leading-relaxed md:text-lg">
            一枚一枚の絨毯には、イランの伝統と織り手の魂が込められています。
            <br className="hidden sm:block" />
            最高級の天然素材を用い、熟練の職人が数ヶ月かけて織り上げたペルシャ絨毯は、
            <br className="hidden sm:block" />
            時を経るほどに味わいを増し、あなたの空間を唯一無二のものにします。
          </p>
          <p className="mt-8 text-primary-800 font-medium">— Persian Rug JP</p>
        </div>
      </section>
    </>
  );
}
