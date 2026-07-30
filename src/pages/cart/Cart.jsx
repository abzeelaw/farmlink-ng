import CartItem from "../../components/cart/CartItem";
import CartSummary from "../../components/cart/CartSummary";
import EmptyCart from "../../components/cart/EmptyCart";
import { useCart } from "../../context/CartContext";

const Cart = () => {
  const {
    cartItems,
    totalProducts,
  } = useCart();

  if (totalProducts === 0) {
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
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">
              Shopping Cart
            </h1>

            <p className="mt-2 text-slate-500">
              {totalProducts} Product{totalProducts > 1 ? "s" : ""} in your cart
            </p>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            {cartItems.map((item) => (
              <CartItem
                key={item.id}
                item={item}
              />
            ))}
          </div>

          <CartSummary />
        </div>
      </div>
    </section>
  );
};

export default Cart;