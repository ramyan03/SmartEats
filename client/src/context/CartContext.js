import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";
import { AuthContext } from "./AuthContext";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);

  const refreshCart = async () => {
    if (!localStorage.getItem("token")) {
      setItems([]);
      setSubtotal(0);
      return;
    }
    const res = await api.get("/cart");
    setItems(res.data.items);
    setSubtotal(res.data.subtotal);
  };

  useEffect(() => {
    if (!authLoading) refreshCart();
    // eslint-disable-next-line
  }, [user, authLoading]);

  const addToCart = async (productId, quantity = 1) => {
    const res = await api.post("/cart/add", { productId, quantity });
    setItems(res.data.items);
    setSubtotal(res.data.subtotal);
  };

  const updateQty = async (productId, quantity) => {
    const res = await api.put("/cart/qty", { productId, quantity });
    setItems(res.data.items);
    setSubtotal(res.data.subtotal);
  };

  const removeItem = async (productId) => {
    const res = await api.delete(`/cart/item/${productId}`);
    setItems(res.data.items);
    setSubtotal(res.data.subtotal);
  };

  const clear = async () => {
    const res = await api.delete("/cart/clear");
    setItems(res.data.items);
    setSubtotal(res.data.subtotal);
  };

  return (
    <CartContext.Provider value={{ items, subtotal, refreshCart, addToCart, updateQty, removeItem, clear }}>
      {children}
    </CartContext.Provider>
  );
}
