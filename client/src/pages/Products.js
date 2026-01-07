import { useContext, useEffect, useState } from "react";
import api from "../api/axios";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Products() {
  const [products, setProducts] = useState([]);
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  const load = async () => {
    const res = await api.get("/products");
    setProducts(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleAdd = async (id) => {
    if (!user) return;
    await addToCart(id, 1);
    alert("Added to cart");
  };

  return (
    <div style={{ padding: 16, maxWidth: 900 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Products</h2>
        {!user && (
          <div>
            <Link to="/login">Login</Link> to add items to cart
          </div>
        )}
      </div>

      {products.length === 0 ? (
        <p>No products yet.</p>
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          {products.map((p) => (
            <div key={p._id} style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong>{p.name}</strong>
                <span>${p.price}</span>
              </div>
              <div style={{ opacity: 0.8, marginTop: 6 }}>{p.description}</div>
              <div style={{ marginTop: 6 }}>Stock: {p.stock}</div>

              <button
                style={{ marginTop: 10 }}
                onClick={() => handleAdd(p._id)}
                disabled={!user}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
