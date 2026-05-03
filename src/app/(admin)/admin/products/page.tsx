// src/app/(admin)/admin/products/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import type { Product } from "@prisma/client";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      {/* ... */}
      <tbody>
        {products.map((product: Product) => (
          <tr key={product.id} className="border-t">
            <td className="p-3">{product.title}</td>
            <td className="p-3">¥{product.price.toLocaleString()}</td>
            <td className="p-3">{product.origin}</td>
            <td className="p-3">
              <Link
                href={`/admin/products/${product.slug}/edit`}
                className="text-primary-700 hover:underline"
              >
                Edit
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
      {/* ... */}
    </div>
  );
}
