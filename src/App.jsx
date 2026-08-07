
import { BrowserRouter, Routes, Route } from "react-router-dom";

/* =========================================
   LAYOUT
========================================= */
import RootLayout from "./layouts/RootLayout";

/* =========================================
   PUBLIC PAGES
========================================= */
import Home from "./pages/public/Home";
import Marketplace from "./pages/public/Marketplace";
import About from "./pages/public/About";
import Contact from "./pages/public/Contact";

/* =========================================
   PRODUCT
========================================= */
import ProductDetails from "./pages/public/ProductDetails";

/* =========================================
   CART & CHECKOUT
========================================= */
import Cart from "./pages/cart/Cart";
import Checkout from "./pages/checkout/Checkout";

/* =========================================
   BUYER ORDERS
========================================= */
import Orders from "./pages/orders/MyOrders";
import OrderDetails from "./pages/orders/OrderDetails";

/* =========================================
   FARMER
========================================= */
import FarmerDashboard from "./pages/farmer/FarmerDashboard";
import FarmerOrders from "./pages/farmer/FarmerOrders";
import FarmerProducts from "./pages/farmer/MyProducts";
import AddProduct from "./pages/farmer/AddProduct";
import FarmProfile from "./pages/farmer/FarmProfile";

/* =========================================
   AUTHENTICATION
========================================= */
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Register";


/* =========================================
   ADMIN
========================================= */
import AdminFarmers from "./pages/admin/Farmers";

const App = () => {
  return (
    <BrowserRouter>

      <Routes>

        {/* =========================================
            SHARED APPLICATION LAYOUT

            Navbar + Footer are provided by
            RootLayout and therefore appear on
            every route inside this section.
        ========================================= */}

        <Route element={<RootLayout />}>

          {/* =========================================
              PUBLIC PAGES
          ========================================= */}

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/marketplace"
            element={<Marketplace />}
          />

          <Route
            path="/about"
            element={<About />}
          />

          <Route
            path="/contact"
            element={<Contact />}
          />


          {/* =========================================
              PRODUCT DETAILS
          ========================================= */}

          <Route
            path="/product/:id"
            element={<ProductDetails />}
          />


          {/* =========================================
              CART
          ========================================= */}

          <Route
            path="/cart"
            element={<Cart />}
          />


          {/* =========================================
              CHECKOUT
          ========================================= */}

          <Route
            path="/checkout"
            element={<Checkout />}
          />


          {/* =========================================
              BUYER ORDERS
          ========================================= */}

          <Route
            path="/orders"
            element={<Orders />}
          />

          <Route
            path="/orders/:id"
            element={<OrderDetails />}
          />


          {/* =========================================
              FARMER DASHBOARD
          ========================================= */}

          <Route
            path="/farmer/dashboard"
            element={<FarmerDashboard />}
          />


          {/* =========================================
              FARMER ORDERS
          ========================================= */}

          <Route
            path="/farmer/orders"
            element={<FarmerOrders />}
          />


          {/* =========================================
              FARMER PRODUCTS
          ========================================= */}

          <Route
            path="/farmer/products"
            element={<FarmerProducts />}
          />

            {/* =========================================
              FARMER PROFILE
          ========================================= */}

          <Route
            path="/farmer/profile"
            element={<FarmProfile />}
          />


          {/* =========================================
              ADD FARMER PRODUCT
          ========================================= */}

          <Route
            path="/farmer/add-product"
            element={<AddProduct />}
          />

        </Route>


        {/* =========================================
            AUTHENTICATION

            These are currently outside RootLayout.
            Therefore Login/Signup don't display
            the application Navbar.
        ========================================= */}

        <Route
          path="/auth/login"
          element={<Login />}
        />

        <Route
          path="/auth/register"
          element={<Signup />}
        />

        {/* =========================================
              ADMIN
          ========================================= */}

        <Route
          path="/admin/farmers"
          element={<AdminFarmers />}
        />

      </Routes>

    </BrowserRouter>
  );
};

export default App;