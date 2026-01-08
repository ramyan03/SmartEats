import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Cart() {
  const { items, subtotal, updateQty, removeItem, clear } = useContext(CartContext);
  const { user, loading } = useContext(AuthContext);
  const nav = useNavigate();

  if (loading) return <div style={{ padding: 16 }}>Loading...</div>;

  if (!user) {
    return (
      <div style={{ padding: 16 }}>
        <h2>Cart</h2>
        <p>
          Please <Link to="/login">login</Link> to view your cart.
        </p>
      </div>
    );
  }

  const goCheckout = () => nav("/checkout");

  return (
    <div style={{ padding: 16, maxWidth: 900 }}>
      <h2>Your Cart</h2>

      {items.length === 0 ? (
        <p>Your cart is empty. Go add some products.</p>
      ) : (
        <>
          <div style={{ display: "grid", gap: 10 }}>
            {items.map((it) => (
              <div key={String(it.productId)} style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <strong>{it.product?.name || "Missing product"}</strong>
                  <span>${it.product?.price ?? "—"}</span>
                </div>

                <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 8 }}>
                  <label>Qty:</label>
                  <input
                    style={{ width: 70 }}
                    type="number"
                    min="1"
                    value={it.quantity}
                    onChange={(e) => updateQty(it.productId, Number(e.target.value))}
                  />
                  <button onClick={() => removeItem(it.productId)}>Remove</button>
                </div>

                {it.product && (
                  <div style={{ marginTop: 8, opacity: 0.85 }}>
                    Line total: ${(it.product.price * it.quantity).toFixed(2)}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <strong>Subtotal: ${subtotal.toFixed(2)}</strong>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={clear}>Clear Cart</button>
              <button onClick={goCheckout}>Checkout</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
