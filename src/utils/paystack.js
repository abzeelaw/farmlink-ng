import PaystackPop from "@paystack/inline-js";

export const initializePayment = ({
  email,
  amount,
  fullName,
  onSuccess,
  onCancel,
}) => {
  const popup = new PaystackPop();

  popup.newTransaction({
    key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,

    email,

    amount: amount * 100, // Kobo

    currency: "NGN",

    firstname: fullName.split(" ")[0],

    lastname: fullName.split(" ").slice(1).join(" "),

    onSuccess(transaction) {
      onSuccess(transaction);
    },

    onCancel() {
      onCancel();
    },
  });
};