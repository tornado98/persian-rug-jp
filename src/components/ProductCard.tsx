"use client";

import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { ShoppingBag } from "lucide-react";

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    slug: string;
    price: number;
    origin: string;
    material: string;
    images: string[];
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.slug,
      title: product.title,
      price: product.price,
      image: product.images[0] || "",
    });
  };

  return (
    <div
      onClick={() => router.push(`/products/${product.slug}`)}
      className="group relative bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden shadow-md hover:shadow-2xl hover:shadow-primary-200/50 transition-all duration-700 ease-out hover:-translate-y-2 cursor-pointer border border-white/50 hover:border-primary-200/70"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ")
          router.push(`/products/${product.slug}`);
      }}
    >
      {/* ------ Image Section ------ */}
      <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-b from-primary-100/50 to-primary-200/30">
        {product.images[0] ? (
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110 group-focus:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-primary-400/70">
            <ShoppingBag className="w-12 h-12 opacity-30" />
          </div>
        )}

        {/* Badge - Origin & Material */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1">
          <span className="px-3 py-1 text-xs font-medium bg-white/80 backdrop-blur-md text-primary-800 rounded-full shadow-sm">
            {product.origin}
          </span>
          <span className="px-3 py-1 text-xs font-medium bg-white/80 backdrop-blur-md text-primary-800 rounded-full shadow-sm">
            {product.material}
          </span>
        </div>

        {/* Hover Overlay with Quick Actions */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-500 flex items-end justify-end p-4">
          <div className="opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
            <button
              onClick={handleAddToCart}
              className="flex items-center gap-2 bg-white/90 backdrop-blur-md text-primary-800 px-4 py-2.5 rounded-full shadow-lg hover:bg-primary-600 hover:text-white transition-colors duration-300 font-medium text-sm"
              aria-label="Add to cart"
            >
              <ShoppingBag className="w-4 h-4" />
              カートに入れる
            </button>
          </div>
        </div>
      </div>

      {/* ------ Info Section ------ */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-primary-900 group-hover:text-primary-600 transition-colors line-clamp-2 leading-snug">
          {product.title}
        </h3>

        <div className="mt-3 flex items-center justify-between">
          <p className="text-2xl font-light text-accent-dark tracking-tight">
            ¥{product.price.toLocaleString()}
          </p>
          {/* Inline cart button for small screens (visible without hover) */}
          <button
            onClick={handleAddToCart}
            className="sm:hidden p-2 rounded-full bg-primary-50 text-primary-700 hover:bg-primary-100 transition-colors"
            aria-label="Add to cart mobile"
          >
            <ShoppingBag className="w-5 h-5" />
          </button>
        </div>

        {/* Quick action for desktop (visible when hovering over card, but we already have the overlay) */}
        {/* We keep the overlay button for desktop, and a small icon for mobile as above */}
      </div>

      {/* Focus ring for accessibility */}
      <div className="absolute inset-0 rounded-3xl ring-2 ring-primary-500/0 group-focus-within:ring-primary-500/70 pointer-events-none transition-all duration-300" />
    </div>
  );
}
