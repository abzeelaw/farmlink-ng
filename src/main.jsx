import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { CheckoutProvider } from "./context/CheckoutContext";
import { ThemeProvider } from "./context/ThemeContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
        <ThemeProvider>
      <CartProvider>
        <CheckoutProvider>
            <App />
        </CheckoutProvider>
      </CartProvider>
        </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>
);