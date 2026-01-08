import { useContext, useEffect, useState } from "react";
import api from "../api/axios";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [msg, setMsg] = useState("");
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    api
      .get("/products")
      .then((res) => setProducts(res.data))
      .catch((e) => setMsg(e.response?.data?.message || e.message));
  }, []);

  const handleAdd = async (id) => {
    if (!user) return;
    try {
      await addToCart(id, 1);
    } catch (e) {
      setMsg(e.response?.data?.message || e.message);
    }
  };

  return (
    <div className="container">
      {/* Banner */}
      <div className="hero">
        <h1>Ramyan’s Restaurant</h1>
        <p>
          Freshly prepared meals, crafted with care. Browse our menu and order your
          favorites.
        </p>
      </div>

      <div className="row">
        <h2 className="h2">Menu</h2>
        {!user ? (
          <div className="muted">
            <Link to="/login">Login</Link> to add items to cart
          </div>
        ) : (
          <span className="badge">Logged in</span>
        )}
      </div>

      {msg && <div className="toastError">{msg}</div>}
      <div className="spacer" />

      {products.length === 0 ? (
        <div className="card cardPad">
          <div className="h2">No products yet</div>
          <div className="muted">Seed products from the backend to populate the menu.</div>
        </div>
      ) : (
        <div className="grid">
          {products.map((p) => {
            const inStock = Number(p.countInStock) > 0;

            return (
              <div key={p._id} className="card cardPad">
                {/* Image */}
                <img
                  src={p.imageUrl}
                  alt={p.name}
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://via.placeholder.com/600x400?text=Ramyan%27s+Restaurant";
                  }}
                  style={{
                    width: "100%",
                    height: "180px",
                    objectFit: "cover",
                    borderRadius: "12px",
                    marginBottom: "10px",
                  }}
                />

                <div className="row">
                  <strong>{p.name}</strong>
                  <span className="badge">${Number(p.price).toFixed(2)}</span>
                </div>

                <div className="muted" style={{ margin: "8px 0" }}>
                  {p.description}
                </div>

                <div className="row">
                  {/* Stock indicator */}
                  {inStock ? (
                    <span style={{ color: "#22c55e", fontWeight: 700 }}>✔ Available</span>
                  ) : (
                    <span style={{ color: "#ef4444", fontWeight: 700 }}>✖ Out of stock</span>
                  )}

                  <button
                    className="btn btnPrimary"
                    disabled={!user || !inStock}
                    onClick={() => handleAdd(p._id)}
                    title={!user ? "Login to add items" : !inStock ? "Out of stock" : "Add to cart"}
                  >
                    Add to cart
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
