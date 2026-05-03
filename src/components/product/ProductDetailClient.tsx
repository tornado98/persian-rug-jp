// src/components/product/ProductDetailClient.tsx
"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import {
  ShoppingBag,
  ShieldCheck,
  RefreshCw,
  Truck,
  Minus,
  Plus,
} from "lucide-react";

interface ProductImage {
  url: string;
  width: number;
  height: number;
}

interface ProductDetailClientProps {
  product: {
    slug: string;
    title: string;
    price: number;
    images: string[];
    origin: string;
    material: string;
    sizeWidth: number;
    sizeHeight: number;
    design: string[];
    colorMain: string;
    description: string;
    tatamiApprox: string;
  };
}

export default function ProductDetailClient({
  product,
}: ProductDetailClientProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem({
      productId: product.slug,
      title: product.title,
      price: product.price,
      image: product.images[0] || "",
      quantity, // we'll modify cartStore to accept quantity? Actually our addItem signature adds 1 by default. We'll adjust.
    });
    // Since addItem currently pushes with quantity 1, we need to add multiple times
    // or better we'll update the cart store to accept quantity parameter.
    // For now, we'll loop manually or modify addItem. I'll adjust store next.
  };

  // Placeholder while we update cartStore to accept quantity in addItem
  // We'll update addItem to accept quantity later, but for now we can do:
  const handleAddToCartWithQuantity = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        productId: product.slug,
        title: product.title,
        price: product.price,
        image: product.images[0] || "",
      });
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-10">
      {/* ---- Image Gallery ---- */}
      <div>
        {/* Main image */}
        <div className="relative aspect-square bg-primary-50 rounded-2xl overflow-hidden shadow-md">
          {product.images.length > 0 ? (
            <img
              src={product.images[selectedImage]}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-primary-400">
              No Image
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {product.images.length > 1 && (
          <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
            {product.images.map((url, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                  idx === selectedImage
                    ? "border-primary-500 ring-2 ring-primary-300"
                    : "border-primary-100 hover:border-primary-300"
                }`}
              >
                <img src={url} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ---- Product Info ---- */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-primary-900 leading-tight">
          {product.title}
        </h1>
        <p className="text-3xl font-light text-accent-dark mt-4">
          ¥{product.price.toLocaleString()}
        </p>

        {/* Details list */}
        <div className="mt-6 space-y-3 text-gray-700 border-t border-primary-100 pt-6">
          <div className="flex justify-between">
            <span className="font-medium">Origin</span>
            <span>{product.origin}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Material</span>
            <span>{product.material}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Dimensions</span>
            <span>
              {product.sizeWidth} × {product.sizeHeight} cm
              <span className="text-sm text-gray-400 ml-2">
                (~{product.tatamiApprox} 畳)
              </span>
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Design</span>
            <span>{product.design.join(" / ")}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Main Color</span>
            <span>{product.colorMain}</span>
          </div>
        </div>

        {/* Description */}
        <div
          className="mt-6 prose prose-sm max-w-none text-gray-700 border-t border-primary-100 pt-6"
          dangerouslySetInnerHTML={{ __html: product.description }}
        />

        {/* Quantity & Add to Cart */}
        <div className="mt-8 border-t border-primary-100 pt-6">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-sm font-medium text-primary-800">
              Quantity
            </span>
            <div className="flex items-center border border-primary-200 rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 hover:bg-primary-50 transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4 text-primary-600" />
              </button>
              <span className="w-10 text-center text-primary-800 font-medium">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-2 hover:bg-primary-50 transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4 text-primary-600" />
              </button>
            </div>
          </div>

          <button
            onClick={handleAddToCartWithQuantity}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2 shadow-md"
          >
            <ShoppingBag className="w-5 h-5" />
            カートに入れる
          </button>

          {/* Trust badges */}
          <div className="mt-6 grid grid-cols-3 gap-3 text-center text-xs text-primary-600">
            <div className="flex flex-col items-center gap-1">
              <ShieldCheck className="w-5 h-5" />
              <span>安全な決済</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <RefreshCw className="w-5 h-5" />
              <span>7日間返品保証</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Truck className="w-5 h-5" />
              <span>全国送料無料</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
