"use client";

import { create } from "zustand";

export interface CartItem {
    id: number;
    name: string;
    price: string;
    priceNum: number;
    quantity: number;
}

interface CartStore {
    items: CartItem[];
    addItem: (item: Omit<CartItem, "quantity">) => void;
    removeItem: (id: number) => void;
    updateQuantity: (id: number, quantity: number) => void;
    clearCart: () => void;
    totalItems: () => number;
    totalPrice: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
    items: [
        { id: 1, name: "Anneau du Néant", price: "890 €", priceNum: 890, quantity: 1 },
        { id: 5, name: "Chevalière du Boss Final", price: "2,100 €", priceNum: 2100, quantity: 1 },
    ],
    addItem: (item) =>
        set((state) => {
            const existing = state.items.find((i) => i.id === item.id);
            if (existing) {
                return {
                    items: state.items.map((i) =>
                        i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                    ),
                };
            }
            return { items: [...state.items, { ...item, quantity: 1 }] };
        }),
    removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
    updateQuantity: (id, quantity) =>
        set((state) => ({
            items: state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        })),
    clearCart: () => set({ items: [] }),
    totalItems: () => get().items.reduce((acc, i) => acc + i.quantity, 0),
    totalPrice: () => get().items.reduce((acc, i) => acc + i.priceNum * i.quantity, 0),
}));
