// src/app/admin/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import type { Product } from "@prisma/client";
import {
  Package,
  Coins,
  ShoppingCart,
  PlusCircle,
  Edit,
  ArrowRight,
} from "lucide-react";

export default async function AdminDashboard() {
  // Fetch aggregate data
  const [totalProducts, totalInventoryValue, recentProducts] =
    await Promise.all([
      prisma.product.count(),
      prisma.product.aggregate({
        _sum: { price: true },
      }),
      prisma.product.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          title: true,
          slug: true,
          price: true,
          inStock: true,
          images: true,
        },
      }),
    ]);

  const totalValue = totalInventoryValue._sum.price ?? 0;

  return (
    <div className="space-y-8">
      {/* Page title */}
      <div>
        <h1 className="text-3xl font-bold text-primary-900">Dashboard</h1>
        <p className="text-primary-600 mt-1">
          ようこそ、ここでストアの概要を管理できます。
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Products */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-primary-100 flex items-center gap-4 hover:shadow-lg transition-shadow">
          <div className="p-3 bg-primary-100 rounded-xl">
            <Package className="w-7 h-7 text-primary-700" />
          </div>
          <div>
            <p className="text-primary-600 text-sm font-medium">
              Total Products
            </p>
            <p className="text-2xl font-bold text-primary-900">
              {totalProducts}
            </p>
          </div>
        </div>

        {/* Total Inventory Value */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-primary-100 flex items-center gap-4 hover:shadow-lg transition-shadow">
          <div className="p-3 bg-accent-light/20 rounded-xl">
            <Coins className="w-7 h-7 text-accent-dark" />
          </div>
          <div>
            <p className="text-primary-600 text-sm font-medium">
              Inventory Value
            </p>
            <p className="text-2xl font-bold text-primary-900">
              ¥{totalValue.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Placeholder for Orders (next phase) */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-primary-100 flex items-center gap-4 opacity-70">
          <div className="p-3 bg-primary-50 rounded-xl">
            <ShoppingCart className="w-7 h-7 text-primary-400" />
          </div>
          <div>
            <p className="text-primary-600 text-sm font-medium">Orders</p>
            <p className="text-2xl font-bold text-primary-400">Coming soon</p>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-3">
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl transition-colors shadow-sm"
        >
          <PlusCircle className="w-5 h-5" />
          Add Product
        </Link>
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 border border-primary-300 text-primary-700 hover:bg-primary-50 px-5 py-2.5 rounded-xl transition-colors"
        >
          <Package className="w-5 h-5" />
          Manage Products
        </Link>
      </div>

      {/* Recent products */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-primary-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-primary-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-primary-900">
            Recent Products
          </h2>
          <Link
            href="/admin/products"
            className="text-sm text-primary-600 hover:underline flex items-center gap-1"
          >
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="divide-y divide-primary-100">
          {recentProducts.length === 0 ? (
            <p className="px-6 py-8 text-center text-primary-500">
              No products yet.
            </p>
          ) : (
            recentProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between px-6 py-3 hover:bg-primary-50/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  {product.images[0] ? (
                    <img
                      src={product.images[0]}
                      alt=""
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center text-primary-400 text-xs">
                      N/A
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-primary-900">
                      {product.title}
                    </p>
                    <p className="text-sm text-primary-500">
                      ¥{product.price.toLocaleString()}{" "}
                      {!product.inStock && (
                        <span className="text-red-500">(Out of Stock)</span>
                      )}
                    </p>
                  </div>
                </div>
                <Link
                  href={`/admin/products/${product.slug}/edit`}
                  className="p-2 hover:bg-white rounded-lg text-primary-600 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
