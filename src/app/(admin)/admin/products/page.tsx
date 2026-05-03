// src/app/(admin)/admin/products/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary-900">Products</h1>
        <Link
          href="/admin/products/new"
          className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700"
        >
          Add Product
        </Link>
      </div>

      <div className="bg-white rounded-lg overflow-hidden shadow">
        <table className="w-full">
          <thead className="bg-primary-100 text-primary-900">
            <tr>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Price (¥)</th>
              <th className="p-3 text-left">Origin</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
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
        </table>
      </div>
    </div>
  );
}
