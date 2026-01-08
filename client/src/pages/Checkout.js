import { useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const nav = useNavigate();

  const [clientSecret, setClientSecret] = useState("");
  const [amount, setAmount] = useState(0);
  const [paymentIntentId, setPaymentIntentId] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.post("/payments/create-intent");
        setClientSecret(res.data.clientSecret);
        setAmount(res.data.amount);
        setPaymentIntentId(res.data.paymentIntentId);
      } catch (e) {
        setMsg(e.response?.data?.message || e.message);
      }
    })();
  }, []);

  const pay = async (e) => {
    e.preventDefault();
    setMsg("");

    if (!stripe || !elements) return;

    setBusy(true);
    try {
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: elements.getElement(CardElement) },
      });

      if (result.error) {
        setMsg(result.error.message || "Payment failed");
        return;
      }

      if (result.paymentIntent?.status === "succeeded") {
        await api.post("/orders/from-cart", { paymentIntentId });
        nav("/orders");
      } else {
        setMsg(`Payment status: ${result.paymentIntent?.status}`);
      }
    } catch (e) {
      setMsg(e.response?.data?.message || e.message);
    } finally {
      setBusy(false);
    }
  };

  if (!clientSecret) return <div style={{ padding: 16 }}>{msg || "Preparing checkout..."}</div>;

  return (
    <div style={{ padding: 16, maxWidth: 520 }}>
      <h2>Checkout</h2>
      <p>Amount: <strong>${amount.toFixed(2)}</strong></p>

      <form onSubmit={pay} style={{ display: "grid", gap: 12 }}>
        <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
          <CardElement />
        </div>

        <button type="submit" disabled={!stripe || busy}>
          {busy ? "Processing..." : "Pay"}
        </button>

        <div style={{ fontSize: 14, opacity: 0.8 }}>
          Test card: <strong>4242 4242 4242 4242</strong> — any future expiry, any CVC, any postal code.
        </div>

        {msg && <div style={{ color: "crimson" }}>{msg}</div>}
      </form>
    </div>
  );
}

export default function Checkout() {
  const options = useMemo(() => ({ appearance: { theme: "stripe" } }), []);
  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm />
    </Elements>
  );
}
