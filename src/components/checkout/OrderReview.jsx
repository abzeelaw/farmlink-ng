import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { Button } from "../ui";
import toast from "react-hot-toast";
import { useCheckout } from "../../context/CheckoutContext";
import { useAuth } from "../../context/AuthContext";
import { initializePayment } from "../../utils/paystack";
import { createOrder } from "../../services/orderService";

const OrderReview = () => {
  const { cartItems, totalItems, totalPrice, clearCart } = useCart();
  const { checkoutData } = useCheckout();
  const { user } = useAuth();

  const [processing, setProcessing] = useState(false);

  const deliveryFee = totalPrice > 0 ? 2500 : 0;
  const total = totalPrice + deliveryFee;

  const handlePayment = () => {
    if (!user) {
      toast.error("Please login before making payment.");
      return;
    }

    if (
      !checkoutData.fullName ||
      !checkoutData.email ||
      !checkoutData.phone ||
      !checkoutData.state ||
      !checkoutData.city ||
      !checkoutData.address
    ) {
      toast.error("Please complete the checkout form.");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    setProcessing(true);

    initializePayment({
      email: checkoutData.email,
      fullName: checkoutData.fullName,
      amount: total,

      onSuccess: async (transaction) => {
        try {
          toast.loading("Creating your order...", {
            id: "creating-order",
          });

          const order = await createOrder({
            userId: user.id,
            checkoutData,
            cartItems,
            totalAmount: total,
            paymentReference: transaction.reference,
          });

          toast.dismiss("creating-order");

          toast.success("Order placed successfully!");

          console.log("Order created:", order);

          clearCart();
        } catch (error) {
          toast.dismiss("creating-order");

          console.error("Order creation error:", error);

          toast.error(
            error.message || "Payment succeeded but order creation failed."
          );
        } finally {
          setProcessing(false);
        }
      },

      onCancel: () => {
        setProcessing(false);
        toast("Payment cancelled.");
      },
    });
  };

  return (
    <div className="sticky top-28 rounded-3xl bg-white p-8 shadow-lg">
      <h2 className="mb-6 text-2xl font-bold">
        Order Review
      </h2>

      {/* Products */}
      <div className="space-y-5">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 border-b border-slate-100 pb-4"
          >
            <img
              src={item.image}
              alt={item.name}
              className="h-16 w-16 rounded-xl object-cover"
            />

            <div className="flex-1">
              <h3 className="font-semibold">
                {item.name}
              </h3>

              <p className="text-sm text-slate-500">
                Qty: {item.quantity}
              </p>
            </div>

            <span className="font-bold text-emerald-600">
              ₦
              {(item.price * item.quantity).toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-8 space-y-4">
        <div className="flex justify-between">
          <span>Total Items</span>
          <span>{totalItems}</span>
        </div>

        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>
            ₦{totalPrice.toLocaleString()}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Delivery Fee</span>
          <span>
            ₦{deliveryFee.toLocaleString()}
          </span>
        </div>

        <hr />

        <div className="flex justify-between text-xl font-bold">
          <span>Total</span>

          <span>
            ₦{total.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Payment Method */}
      <div className="mt-8">
        <h3 className="mb-3 font-semibold">
          Payment Method
        </h3>

        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-emerald-500 bg-emerald-50 p-4">
          <input
            type="radio"
            checked
            readOnly
          />

          <div>
            <p className="font-semibold">
              Paystack
            </p>

            <p className="text-sm text-slate-500">
              Secure online payment with card, bank transfer,
              USSD and more.
            </p>
          </div>
        </label>
      </div>

      {/* Payment Button */}
      <Button
        className="mt-8 w-full"
        onClick={handlePayment}
        disabled={processing}
      >
        {processing
          ? "Processing..."
          : "Proceed to Payment"}
      </Button>
    </div>
  );
};

export default OrderReview;