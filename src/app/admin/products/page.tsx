// src/app/admin/products/page.tsx
import { prisma } from "@/lib/prisma";
import type { Product } from "@prisma/client";
import AdminProductTable from "@/components/admin/AdminProductTable";

export default async function AdminProductsPage() {
  const products: Product[] = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-primary-900">Products</h1>
      <AdminProductTable products={products} />
    </div>
  );
}
