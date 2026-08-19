import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import RootLayout from "../layouts/RootLayout";
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";

import Home from "../pages/public/Home";
import Marketplace from "../pages/public/Marketplace";
import About from "../pages/public/About";
import Contact from "../pages/public/Contact";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import ProductDetails from "../pages/public/ProductDetails";
import Farmers from "../pages/public/Farmers";
import FarmerProfile from "../pages/public/FarmerProfile";
import Cart from "../pages/cart/Cart";
import Checkout from "../pages/checkout/Checkout";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import AddProduct from "../pages/farmer/AddProduct";
import FarmProfile from "../pages/farmer/FarmProfile";
import MyOrders from "../pages/orders/MyOrders";
import OrderDetails from "../pages/orders/OrderDetails";
import FarmerOrders from "../pages/farmer/FarmerOrders";
import FarmerDashboard from "../pages/farmer/FarmerDashboard";
import MyProducts from "../pages/farmer/MyProducts";
import EditProduct from "../pages/farmer/EditProduct";
import RoleProtectedRoute from "../components/auth/RoleProtectedRoute";
import AdminFarmers from "../pages/admin/Farmers";


const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "marketplace",
        element: <Marketplace />,
      },
      {
        path: "cart",
        element: (
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        ),
      },
      {
        path: "checkout",
        element: <Checkout />,
      },
      {
  path: "orders",
  element: <MyOrders />,
},
{
  path: "orders/:id",
  element: <OrderDetails />,
},
      {
        path: "about",
        element: <About />,
      },
      {
        path: "contact",
        element: <Contact />,
      },
      {
        path: "product/:id",
        element: <ProductDetails />
      }
      ,
      {
        path: "farmers",
        element: <Farmers />,
      },
      {
        path: "farmer/:id",
        element: <FarmerProfile />,
      }
    ],
  },

  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "reset-password",
        element: <ResetPassword />,
      },
    ],
  },

  {
    path: "/buyer",
    element: <DashboardLayout />,
    children: [],
  },

 {
  path: "/farmer",
  element: <DashboardLayout />,
  children: [
    {
      path: "add-product",
      element: <AddProduct />,
    },
    {
      path: "profile",
      element: <FarmProfile />,
    },
    {
  path: "orders",
  element: <FarmerOrders />,
},
{
  path: "dashboard",
  element: <FarmerDashboard />,
},
{
  path: "products",
  element: <MyProducts />,
},
{
  path: "products/edit/:id",
  element: <EditProduct />,
},
  ],
},

  {
    path: "/admin",
    element: <DashboardLayout />,
    children: [
      {
        path: "farmers",
        element: (
          <RoleProtectedRoute role="admin">
            <AdminFarmers />
          </RoleProtectedRoute>
        ),
      },
    ],
  },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;