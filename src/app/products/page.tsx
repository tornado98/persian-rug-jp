// src/app/products/page.tsx
import { prisma } from "@/lib/prisma";
import type { Product } from "@prisma/client";
import ProductCard from "@/components/ProductCard";
import ProductFilters from "@/components/product/ProductFilters";
import SortDropdown from "@/components/product/SortDropdown";
import { ArrowDownWideNarrow } from "lucide-react";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Extract filter values
  const search =
    typeof searchParams.search === "string" ? searchParams.search : "";
  const origin =
    typeof searchParams.origin === "string" ? searchParams.origin : "";
  const material =
    typeof searchParams.material === "string" ? searchParams.material : "";
  const design =
    typeof searchParams.design === "string" ? searchParams.design : "";
  const minPrice =
    typeof searchParams.minPrice === "string"
      ? Number(searchParams.minPrice)
      : undefined;
  const maxPrice =
    typeof searchParams.maxPrice === "string"
      ? Number(searchParams.maxPrice)
      : undefined;
  const sort =
    typeof searchParams.sort === "string"
      ? searchParams.sort
      : "createdAt-desc";

  // Build where clause
  const where: any = { inStock: true };
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { origin: { contains: search, mode: "insensitive" } },
      { material: { contains: search, mode: "insensitive" } },
      { colorMain: { contains: search, mode: "insensitive" } },
    ];
  }
  if (origin) where.origin = { contains: origin, mode: "insensitive" };
  if (material) where.material = { contains: material, mode: "insensitive" };
  if (design) where.design = { has: design };

  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = minPrice;
    if (maxPrice) where.price.lte = maxPrice;
  }

  // Sorting
  let orderBy: any = { createdAt: "desc" };
  switch (sort) {
    case "price-asc":
      orderBy = { price: "asc" };
      break;
    case "price-desc":
      orderBy = { price: "desc" };
      break;
    case "title-asc":
      orderBy = { title: "asc" };
      break;
  }

  const products: Product[] = await prisma.product.findMany({
    where,
    orderBy,
  });

  return (
    <main className="max-w-7xl mx-auto px-4 py-10">
      {/* Page title */}
      <h1 className="text-3xl md:text-5xl font-bold text-primary-800 mb-2 tracking-tight">
        商品一覧
      </h1>
      <p className="text-primary-600 mb-8 text-sm md:text-base">
        イラン直輸入の手織り絨毯から、お気に入りの一枚を見つけてください。
      </p>

      {/* Toolbar: results count + sort */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <p className="text-primary-700 text-sm">
          <span className="font-semibold">{products.length}</span>{" "}
          点の商品が見つかりました
          {(search || origin || material || design || minPrice || maxPrice) && (
            <span className="text-primary-500"> (フィルター適用中)</span>
          )}
        </p>
        <div className="flex items-center gap-2">
          <ArrowDownWideNarrow className="w-4 h-4 text-primary-500 hidden sm:block" />
          <SortDropdown currentSort={sort} />
        </div>
      </div>

      {/* Filters */}
      <div className="mb-8">
        <ProductFilters />
      </div>

      {/* Product grid */}
      {products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-primary-600 text-lg">
            条件に一致する商品が見つかりませんでした。
          </p>
          <p className="text-primary-400 text-sm mt-2">
            キーワードやフィルターを変更してお試しください。
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
