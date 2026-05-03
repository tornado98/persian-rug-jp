// src/components/layout/Header.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { ShoppingBag, User } from "lucide-react";

export default function Header() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-primary-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-bold text-primary-800 tracking-wide hover:text-primary-600 transition-colors"
        >
          Persian Rug JP
        </Link>

        {/* Navigation - desktop */}
        <nav className="hidden sm:flex items-center gap-6">
          <Link
            href="/"
            className="text-primary-700 hover:text-primary-600 transition-colors font-medium"
          >
            ホーム
          </Link>
          <Link
            href="/products"
            className="text-primary-700 hover:text-primary-600 transition-colors font-medium"
          >
            商品一覧
          </Link>
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          {/* Sign In / Account */}
          <Link
            href="/auth/signin"
            className="p-2 rounded-lg hover:bg-primary-50 transition-colors"
            aria-label="Account"
          >
            <User className="w-5 h-5 text-primary-700" />
          </Link>

          {/* Cart */}
          <button
            onClick={() => router.push("/cart")}
            className="relative p-2 rounded-lg hover:bg-primary-50 transition-colors"
            aria-label="Cart"
          >
            <ShoppingBag className="w-5 h-5 text-primary-700" />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-primary-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
