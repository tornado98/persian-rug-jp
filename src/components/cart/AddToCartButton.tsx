"use client";

import { useCartStore } from "@/store/cartStore";

type AddToCartButtonProps = {
  productId: string;
  title: string;
  price: number;
  image: string;
};

export default function AddToCartButton({
  productId,
  title,
  price,
  image,
}: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAdd = () => {
    addItem({ productId, title, price, image });
  };

  return (
    <button
      onClick={handleAdd}
      className="mt-8 w-full bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
    >
      カートに入れる
    </button>
  );
}
