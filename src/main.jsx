import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { CheckoutProvider } from "./context/CheckoutContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <CheckoutProvider>
          <App />
        </CheckoutProvider>
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);