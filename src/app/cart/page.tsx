"use client";

import { useCartStore } from "@/store/cartStore";
import Link from "next/link";

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  if (items.length === 0) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-primary-800 mb-4">
          ショッピングカート
        </h1>
        <p className="text-gray-600">カートに商品がありません。</p>
        <Link
          href="/"
          className="mt-6 inline-block text-primary-600 hover:underline"
        >
          お買い物を続ける
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-primary-800 mb-8">
        ショッピングカート
      </h1>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.productId}
            className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-lg shadow"
          >
            {/* Image */}
            <div className="w-24 h-24 flex-shrink-0 bg-primary-100 rounded overflow-hidden">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No img
                </div>
              )}
            </div>

            {/* Details */}
            <div className="flex-1">
              <h3 className="font-semibold text-primary-900">{item.title}</h3>
              <p className="text-sm text-gray-500">
                ¥{item.price.toLocaleString()} × {item.quantity}
              </p>
              <p className="font-bold text-primary-800 mt-1">
                ¥{(item.price * item.quantity).toLocaleString()}
              </p>
            </div>

            {/* Quantity controls and remove */}
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  updateQuantity(item.productId, item.quantity - 1)
                }
                className="px-2 py-1 border rounded text-gray-600 hover:bg-gray-50"
              >
                −
              </button>
              <span className="w-8 text-center">{item.quantity}</span>
              <button
                onClick={() =>
                  updateQuantity(item.productId, item.quantity + 1)
                }
                className="px-2 py-1 border rounded text-gray-600 hover:bg-gray-50"
              >
                +
              </button>
              <button
                onClick={() => removeItem(item.productId)}
                className="ml-4 text-red-500 hover:text-red-700 text-sm"
              >
                削除
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Total and checkout */}
      <div className="mt-8 p-6 bg-primary-50 rounded-lg text-right">
        <p className="text-lg">
          小計:{" "}
          <span className="font-bold text-accent-dark">
            ¥{total.toLocaleString()}
          </span>
        </p>
        <button
          className="mt-4 bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
          disabled
        >
          チェックアウトに進む (準備中)
        </button>

        <Link
          href="/"
          className="ml-4 inline-block text-primary-600 hover:underline"
        >
          買い物を続ける
        </Link>
      </div>
    </main>
  );
}
