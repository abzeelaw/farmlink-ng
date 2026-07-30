import CheckoutForm from "../../components/checkout/CheckoutForm";
import OrderReview from "../../components/checkout/OrderReview";
import { useCart } from "../../context/CartContext";
import EmptyCart from "../../components/cart/EmptyCart";

const Checkout = () => {
  const { cartItems } = useCart();

  if (cartItems.length === 0) {
    return (
      <section className="section-padding">
        <div className="container-width">
          <EmptyCart />
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding bg-slate-50">
      <div className="container-width">
        <div className="mb-12">
          <h1 className="text-4xl font-bold">
            Checkout
          </h1>

          <p className="mt-2 text-slate-500">
            Complete your order details before making payment.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <CheckoutForm />
          </div>

          <OrderReview />
        </div>
      </div>
    </section>
  );
};

export default Checkout;