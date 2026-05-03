// src/store/cartStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

// Type definition for a single cart item
export type CartItem = {
  productId: string; // slug
  title: string;
  price: number; // in JPY
  image: string;
  quantity: number;
};

// Type for the store itself
type CartStore = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
};

// Create the Zustand store with persist middleware (localStorage)
export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],

      // Add an item; if it exists, increase quantity by 1
      addItem: (item, qty = 1) =>
        set((state) => {
          const existing = state.items.find(
            (i) => i.productId === item.productId,
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId
                  ? { ...i, quantity: i.quantity + qty }
                  : i,
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity: qty }] };
        }),

      // Remove item completely
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        })),

      // Update quantity (if quantity <= 0, remove item)
      updateQuantity: (productId, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter((i) => i.productId !== productId),
            };
          }
          return {
            items: state.items.map((i) =>
              i.productId === productId ? { ...i, quantity } : i,
            ),
          };
        }),

      // Empty the cart
      clearCart: () => set({ items: [] }),
    }),
    {
      name: "persian-rug-cart", // key in localStorage
    },
  ),
);
