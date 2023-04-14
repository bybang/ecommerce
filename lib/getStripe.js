import { loadStripe } from "@stripe/stripe-js";

// empty promise, undefined at the start
let stripePromise;

const getStripe = () => {
  // does stripe promise yet exist?
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
  }

  return stripePromise;
};

export default getStripe;
