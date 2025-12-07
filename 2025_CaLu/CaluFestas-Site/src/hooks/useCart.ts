// src/hooks/useCart.ts
import { useEffect, useState } from "react";
import { Product } from "../interfaces/product";
import { toast } from "react-toastify";

interface CartItem {
  _id: string,
  nome: string;
  quantidade: number;
  preco: string | number;
  descricao: string;
  imagem: string[];
}

const CART_KEY = "cart";

export function useCart() {
  // ---------- carregar do localStorage ----------
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(CART_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // ---------- salvar a cada mudança ----------
  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  // ---------- espelhar alterações vindas de OUTRAS abas ----------
  useEffect(() => {
    const sync = (e: StorageEvent) => {
      if (e.key === CART_KEY) {
        setCart(e.newValue ? JSON.parse(e.newValue) : []);
      }
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  // ---------- operações públicas ----------
  const addToCart = (product: Product, quantity: number) => {
    if (quantity <= 0) {
      toast.error(`O produto precisa ter uma quantidade maior que 1`);
      return
    };

    
    setCart((prev) => {
      const existing = prev.find((i) => i._id === product._id);
      if (existing){
        if (existing.quantidade + quantity > product.quantidade - product.quantidadeemlocacao) {
          toast.info("Quantidade em estoque excedida", {toastId: "maxDragon"})
          return existing
          ? prev.map((i) =>
            i._id === product._id
              ? { ...i, quantidade: product.quantidade - product.quantidadeemlocacao }
              : i
          )
        : [...prev, { _id: product._id, nome: product.nome, quantidade: quantity, descricao: product.descricao, preco: product.preco, imagem: product.imagem }];
        }
        else {
          toast.success(`Adicionado ${quantity} itens: ${product.nome} ao carrinho`, { toastId: "AddCart" });
          return existing
        ? prev.map((i) =>
            i._id === product._id
              ? { ...i, quantidade: i.quantidade + quantity }
              : i
          )
        : [...prev, { _id: product._id, nome: product.nome, quantidade: quantity, descricao: product.descricao, preco: product.preco, imagem: product.imagem }];
        }
      }
      return existing
        ? prev.map((i) =>
            i._id === product._id
              ? { ...i, quantidade: i.quantidade + quantity }
              : i
          )
        : [...prev, { _id: product._id, nome: product.nome, quantidade: quantity, descricao: product.descricao, preco: product.preco, imagem: product.imagem }];
    });
  };

  const removeFromCart = (_id: string) => {
    const item = cart.find((i) => i._id === _id);
    if (item) toast.info(`Removido: ${item.nome}`, { toastId: "RemoveCart" });
    setCart((prev) => prev.filter((i) => i._id !== _id));
  }

  const changeQuantity = (_id: string, quantity: number) => {
    const item = cart.find((i) => i._id === _id);
    if (!item) return;

    if (quantity <= 0) {
      removeFromCart(_id);
      return;
    }

    toast.info(`Atualizado: ${item.nome} (x${quantity})`, { toastId: "ChangeCart" });
    setCart((prev) =>
      prev.map((i) => (i._id === _id ? { ...i, quantidade: quantity } : i))
    );
  };


  const clearCart = () => {
    toast.warn("Carrinho limpo." , { toastId: "carrinholimpo" });
    setCart([]);
  };


  return { cart, addToCart, removeFromCart, changeQuantity, clearCart };
}
