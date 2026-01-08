import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    api
      .get("/orders/mine")
      .then((res) => setOrders(res.data))
      .catch((e) => setMsg(e.response?.data?.message || e.message));
  }, []);

  return (
    <div style={{ padding: 16, maxWidth: 900 }}>
      <h2>Your Orders</h2>

      {msg && <div style={{ color: "crimson" }}>{msg}</div>}

      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          {orders.map((o) => (
            <div
              key={o._id}
              style={{
                border: "1px solid #ddd",
                borderRadius: 8,
                padding: 12,
              }}
            >
              <div>
                <strong>Total:</strong> ${o.total.toFixed(2)}
              </div>
              <div>
                <strong>Status:</strong> {o.status}
              </div>
              <div style={{ opacity: 0.8 }}>
                <strong>PaymentIntent:</strong> {o.paymentIntentId}
              </div>

              <div style={{ marginTop: 8 }}>
                <strong>Items:</strong>
                <ul>
                  {o.items.map((it, idx) => (
                    <li key={idx}>
                      {it.name} × {it.quantity} (${it.price})
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
