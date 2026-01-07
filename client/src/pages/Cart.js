import { useContext } from "react";
import { CartContext } from "../context/CartContext";

export default function Cart() {
  const { cart } = useContext(CartContext);
  return cart.map((item, i) => <div key={i}>{item.name}</div>);
}
