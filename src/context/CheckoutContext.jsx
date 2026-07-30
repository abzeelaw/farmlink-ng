import { createContext, useContext, useState } from "react";

const CheckoutContext = createContext();

export const CheckoutProvider = ({ children }) => {
  const [checkoutData, setCheckoutData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    state: "",
    city: "",
    notes: "",
  });

  return (
    <CheckoutContext.Provider
      value={{
        checkoutData,
        setCheckoutData,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
};

export const useCheckout = () => {
  const context = useContext(CheckoutContext);

  if (!context) {
    throw new Error(
      "useCheckout must be used inside CheckoutProvider"
    );
  }

  return context;
};