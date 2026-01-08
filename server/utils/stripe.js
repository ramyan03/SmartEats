const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const createPaymentIntent = async (amount) => {
  const cents = Math.round(Number(amount) * 100);
  return await stripe.paymentIntents.create({
    amount: cents,
    currency: "usd",
    payment_method_types: ["card"],
  });
};

module.exports = { stripe, createPaymentIntent };
