import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CartItem = {
  _id: string;
  nome: string;
  preco: number;
  quantidade: number;
  imagem?: string;
  descricao?: string;
  categoria?: string;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  updateQuantity: (id: string, quantidade: number) => void;
  increment: (id: string, step?: number) => void;
  decrement: (id: string, step?: number) => void;
};

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem("cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  // Adiciona com merge (soma quantidade se já existir)
  const addToCart: CartContextType["addToCart"] = (item) => {
    setCart((prev) => {
      const idx = prev.findIndex((i) => i._id === item._id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantidade: next[idx].quantidade + item.quantidade };
        return next;
      }
      return [...prev, item];
    });
  };

  const removeFromCart: CartContextType["removeFromCart"] = (id) => {
    setCart((prev) => prev.filter((i) => i._id !== id));
  };

  const clearCart: CartContextType["clearCart"] = () => setCart([]);

  const updateQuantity: CartContextType["updateQuantity"] = (id, quantidade) => {
    setCart((prev) => {
      if (quantidade <= 0) return prev.filter((i) => i._id !== id);
      return prev.map((i) => (i._id === id ? { ...i, quantidade } : i));
    });
  };

  const increment: CartContextType["increment"] = (id, step = 1) => {
    setCart((prev) => prev.map((i) => (i._id === id ? { ...i, quantidade: i.quantidade + step } : i)));
  };

  const decrement: CartContextType["decrement"] = (id, step = 1) => {
    setCart((prev) =>
      prev
        .map((i) => (i._id === id ? { ...i, quantidade: Math.max(1, i.quantidade - step) } : i))
        .filter((i) => i.quantidade > 0)
    );
  };

  const value = useMemo(
    () => ({ cart, addToCart, removeFromCart, clearCart, updateQuantity, increment, decrement }),
    [cart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart deve ser usado dentro de <CartProvider>");
  return ctx;
};
