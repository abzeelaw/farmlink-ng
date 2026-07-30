import { Link } from "react-router-dom";
import { Button } from "../ui";
import { useCart } from "../../context/CartContext";

const CartSummary = () => {
  const {
    totalPrice,
    totalItems,
    clearCart,
  } = useCart();

  const deliveryFee = totalPrice > 0 ? 2500 : 0;

  const total = totalPrice + deliveryFee;

  return (
    <div className="sticky top-28 rounded-3xl bg-white p-8 shadow-lg">
      <h2 className="mb-6 text-2xl font-bold">
        Order Summary
      </h2>

      <div className="space-y-4">
        <div className="flex justify-between">
          <span>Items</span>
          <span>{totalItems}</span>
        </div>

        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>₦{totalPrice.toLocaleString()}</span>
        </div>

        <div className="flex justify-between">
          <span>Delivery</span>
          <span>₦{deliveryFee.toLocaleString()}</span>
        </div>

        <hr />

        <div className="flex justify-between text-xl font-bold">
          <span>Total</span>
          <span>₦{total.toLocaleString()}</span>
        </div>
      </div>

      <Link to="/checkout">
        <Button className="mt-8 w-full">
          Proceed to Checkout
        </Button>
      </Link>

      <Button
        variant="outline"
        className="mt-4 w-full"
        onClick={clearCart}
      >
        Clear Cart
      </Button>
    </div>
  );
};

export default CartSummary;