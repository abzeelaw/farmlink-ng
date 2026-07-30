import { useEffect, useState } from "react";
import {
  Package,
  ShoppingBag,
  Clock,
  PlusCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../../context/AuthContext";
import {
  getFarmerDashboardStats,
  getRecentFarmerOrders,
} from "../../services/farmerService";

const FarmerDashboard = () => {
  const { user, loading: authLoading } = useAuth();

  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    productsSold: 0,
    pendingOrders: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      if (authLoading) return;

      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Load dashboard statistics
        const statsData = await getFarmerDashboardStats(user.id);

        setStats(statsData);

        // Load recent orders
        const recentData = await getRecentFarmerOrders(user.id);

        setRecentOrders(recentData);
      } catch (error) {
        console.error("Dashboard error:", error);

        toast.error(
          error.message || "Failed to load dashboard data."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [user, authLoading]);

  // Authentication loading
  if (authLoading) {
    return (
      <section className="section-padding">
        <div className="container-width">
          <p className="text-slate-500">
            Loading dashboard...
          </p>
        </div>
      </section>
    );
  }

  // User is not logged in
  if (!user) {
    return (
      <section className="section-padding">
        <div className="container-width">
          <h1 className="text-3xl font-bold text-slate-900">
            Please log in
          </h1>

          <p className="mt-2 text-slate-500">
            You need to be logged in to access the farmer dashboard.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding bg-slate-50">
      <div className="container-width">

        {/* ================= HEADER ================= */}
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">
              Farmer Dashboard
            </h1>

            <p className="mt-2 text-slate-500">
              Manage your products, orders, and sales.
            </p>
          </div>

          <Link
            to="/farmer/add-product"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700"
          >
            <PlusCircle size={20} />
            Add Product
          </Link>
        </div>

        {/* ================= STATISTICS ================= */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">

          {/* Total Sales */}
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100">
              <ShoppingBag
                className="text-emerald-600"
                size={24}
              />
            </div>

            <p className="text-sm font-medium text-slate-500">
              Total Sales
            </p>

            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              {loading
                ? "..."
                : `₦${stats.totalSales.toLocaleString()}`}
            </h2>
          </div>

          {/* Total Orders */}
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
              <Package
                className="text-blue-600"
                size={24}
              />
            </div>

            <p className="text-sm font-medium text-slate-500">
              Total Orders
            </p>

            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              {loading ? "..." : stats.totalOrders}
            </h2>
          </div>

          {/* Products Sold */}
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100">
              <Package
                className="text-purple-600"
                size={24}
              />
            </div>

            <p className="text-sm font-medium text-slate-500">
              Products Sold
            </p>

            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              {loading ? "..." : stats.productsSold}
            </h2>
          </div>

          {/* Pending Orders */}
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100">
              <Clock
                className="text-orange-600"
                size={24}
              />
            </div>

            <p className="text-sm font-medium text-slate-500">
              Pending Orders
            </p>

            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              {loading ? "..." : stats.pendingOrders}
            </h2>
          </div>

        </div>

        {/* ================= QUICK ACTIONS ================= */}
        <div className="mt-10 grid gap-6 md:grid-cols-2">

          {/* Add Product */}
          <Link
            to="/farmer/add-product"
            className="rounded-3xl bg-emerald-600 p-8 text-white transition hover:bg-emerald-700"
          >
            <PlusCircle size={32} />

            <h2 className="mt-4 text-2xl font-bold">
              Add New Product
            </h2>

            <p className="mt-2 text-emerald-50">
              List fresh farm produce for customers to discover.
            </p>
          </Link>

          {/* Manage Orders */}
          <Link
            to="/farmer/orders"
            className="rounded-3xl bg-white p-8 shadow-sm transition hover:shadow-md"
          >
            <ShoppingBag
              size={32}
              className="text-emerald-600"
            />

            <h2 className="mt-4 text-2xl font-bold text-slate-900">
              Manage Orders
            </h2>

            <p className="mt-2 text-slate-500">
              View customer orders and update their status.
            </p>
          </Link>

           {/* Manage Products */}
  <Link
    to="/farmer/products"
    className="rounded-3xl bg-white p-8 shadow-sm transition hover:shadow-md"
  >
    <Package
      size={32}
      className="text-emerald-600"
    />

    <h2 className="mt-4 text-2xl font-bold text-slate-900">
      Manage Products
    </h2>

    <p className="mt-2 text-slate-500">
      View, edit, update stock, and manage your listed products.
    </p>
  </Link>
        </div>

        {/* ================= RECENT ORDERS ================= */}
        <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm">

          {/* Section Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Recent Orders
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Your latest customer orders
              </p>
            </div>

            <Link
              to="/farmer/orders"
              className="font-semibold text-emerald-600 transition hover:text-emerald-700"
            >
              View All
            </Link>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="py-8 text-center">
              <p className="text-slate-500">
                Loading recent orders...
              </p>
            </div>
          ) : recentOrders.length === 0 ? (

            /* No Orders */
            <div className="rounded-2xl bg-slate-50 p-8 text-center">
              <Package
                size={40}
                className="mx-auto text-slate-400"
              />

              <h3 className="mt-4 font-semibold text-slate-700">
                No orders yet
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Customer orders for your products will appear here.
              </p>
            </div>

          ) : (

            /* Orders */
            <div className="space-y-4">
              {recentOrders.map((item) => {
                const order = item.orders;
                const product = item.products;

                return (
                  <div
                    key={item.id}
                    className="flex flex-col gap-4 rounded-2xl border border-slate-100 p-4 transition hover:border-emerald-100 hover:shadow-sm md:flex-row md:items-center md:justify-between"
                  >

                    {/* Product */}
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100">
                        <Package
                          size={22}
                          className="text-emerald-600"
                        />
                      </div>

                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {product?.name || "Product"}
                        </h3>

                        <p className="text-sm text-slate-500">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                    </div>

                    {/* Amount */}
                    <div>
                      <p className="text-sm text-slate-500">
                        Amount
                      </p>

                      <p className="font-bold text-emerald-600">
                        ₦
                        {Number(
                          item.subtotal || 0
                        ).toLocaleString()}
                      </p>
                    </div>

                    {/* Location */}
                    <div>
                      <p className="text-sm text-slate-500">
                        Location
                      </p>

                      <p className="font-medium text-slate-700">
                        {order?.delivery_city || "N/A"}
                        {order?.delivery_state
                          ? `, ${order.delivery_state}`
                          : ""}
                      </p>
                    </div>

                    {/* Payment */}
                    <div>
                      <p className="text-sm text-slate-500">
                        Payment
                      </p>

                      <p className="font-medium capitalize text-slate-700">
                        {order?.payment_status || "Pending"}
                      </p>
                    </div>

                    {/* Status */}
                    <span
                      className={`w-fit rounded-full px-3 py-1 text-sm font-semibold capitalize ${
                        order?.order_status === "processing"
                          ? "bg-blue-100 text-blue-700"
                          : order?.order_status === "delivered"
                          ? "bg-emerald-100 text-emerald-700"
                          : order?.order_status === "cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {order?.order_status || "pending"}
                    </span>

                  </div>
                );
              })}
            </div>
          )}

        </div>

      </div>
    </section>
  );
};

export default FarmerDashboard;