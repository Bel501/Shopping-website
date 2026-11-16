import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  key: string;
  productId: string;
  slug: string;
  name: string;
  variantName: string;
  variantHex: string;
  imageUrl: string;
  size: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (item: Omit<CartItem, 'key' | 'quantity'>, qty?: number) => void;
  removeItem: (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      addItem: (item, qty = 1) =>
        set((state) => {
          const key = `${item.productId}-${item.variantName}-${item.size}`;
          const existing = state.items.find((i) => i.key === key);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.key === key ? { ...i, quantity: i.quantity + qty } : i
              ),
            };
          }
          return {
            items: [...state.items, { ...item, key, quantity: qty }],
          };
        }),
      removeItem: (key) =>
        set((state) => ({
          items: state.items.filter((i) => i.key !== key),
        })),
      updateQuantity: (key, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => i.key !== key)
              : state.items.map((i) => (i.key === key ? { ...i, quantity } : i)),
        })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'velox-cart-storage',
      partialize: (state) => ({ items: state.items }),
    }
  )
);
