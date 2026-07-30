
import { useEffect, useState } from "react";
import {
  Package,
  ShoppingBag,
  Wallet,
  Clock,
  ArrowRight,
  User,
} from "lucide-react";
import { Link } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import {
  getFarmerProfile,
  getFarmerDashboardStats,
  getRecentFarmerOrders,
  getFarmerProductsSold,
} from "../../services/farmerService";

const FarmerDashboard = () => {
  const { user } = useAuth();

  const [farmer, setFarmer] = useState(null);
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
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const [
          farmerProfile,
          dashboardStats,
          farmerOrders,
          productsSold,
        ] = await Promise.all([
          getFarmerProfile(user.id),
          getFarmerDashboardStats(user.id),
          getRecentFarmerOrders(user.id),
          getFarmerProductsSold(user.id),
        ]);

        setFarmer(farmerProfile);

        setStats({
          ...dashboardStats,
          productsSold,
        });

        setRecentOrders(farmerOrders);
      } catch (error) {
        console.error(
          "Failed to load farmer dashboard:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [user]);

  if (loading) {
    return (
      <section className="section-padding bg-slate-50">
        <div className="container-width">
          <p className="text-slate-500">
            Loading your dashboard...
          </p>
        </div>
      </section>
    );
  }

  const farmerName =
    farmer?.full_name ||
    user?.user_metadata?.full_name ||
    "Farmer";

  return (
    <section className="min-h-screen bg-slate-50 py-10">
      <div className="container-width">

        {/* =========================================
            WELCOME HEADER
        ========================================= */}

        <div className="mb-10 rounded-3xl bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <div className="mb-3 flex items-center gap-2 text-emerald-600">
                <User size={20} />

                <span className="font-semibold">
                  Farmer Dashboard
                </span>
              </div>

              <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
                Welcome back, {farmerName} 👋
              </h1>

              <p className="mt-2 text-slate-500">
                Manage your products, orders, sales,
                and earnings from one place.
              </p>
            </div>

            <Link
              to="/farmer/products"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700"
            >
              Manage Products
              <ArrowRight size={18} />
            </Link>

          </div>
        </div>


        {/* =========================================
            STATISTICS
        ========================================= */}

        <div className="mb-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          {/* Total Sales */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Total Sales
                </p>

                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                  ₦
                  {Number(
                    stats.totalSales || 0
                  ).toLocaleString()}
                </h2>
              </div>

              <div className="rounded-xl bg-emerald-100 p-3">
                <Wallet
                  size={22}
                  className="text-emerald-600"
                />
              </div>
            </div>
          </div>


          {/* Total Orders */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Total Orders
                </p>

                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                  {stats.totalOrders || 0}
                </h2>
              </div>

              <div className="rounded-xl bg-blue-100 p-3">
                <ShoppingBag
                  size={22}
                  className="text-blue-600"
                />
              </div>
            </div>
          </div>


          {/* Products Sold */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Products Sold
                </p>

                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                  {stats.productsSold || 0}
                </h2>
              </div>

              <div className="rounded-xl bg-purple-100 p-3">
                <Package
                  size={22}
                  className="text-purple-600"
                />
              </div>
            </div>
          </div>


          {/* Pending Orders */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Pending Orders
                </p>

                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                  {stats.pendingOrders || 0}
                </h2>
              </div>

              <div className="rounded-xl bg-orange-100 p-3">
                <Clock
                  size={22}
                  className="text-orange-600"
                />
              </div>
            </div>
          </div>

        </div>


        {/* =========================================
            RECENT ORDERS
        ========================================= */}

        <div className="rounded-3xl bg-white shadow-sm">

          <div className="flex flex-col gap-3 border-b border-slate-100 p-6 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Recent Orders
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Orders containing your products.
              </p>
            </div>

            <Link
              to="/farmer/orders"
              className="inline-flex items-center gap-2 font-semibold text-emerald-600 hover:text-emerald-700"
            >
              View All Orders
              <ArrowRight size={18} />
            </Link>

          </div>


          {/* Empty State */}

          {recentOrders.length === 0 ? (
            <div className="p-10 text-center">

              <Package
                size={45}
                className="mx-auto text-slate-300"
              />

              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                No orders yet
              </h3>

              <p className="mt-2 text-slate-500">
                Orders containing your products will
                appear here.
              </p>

            </div>
          ) : (

            <div className="divide-y divide-slate-100">

              {recentOrders.map((farmerOrder) => {

                const order =
                  farmerOrder.orders;

                const firstItem =
                  farmerOrder.items?.[0];

                const product =
                  firstItem?.products;

                return (
                  <div
                    key={farmerOrder.id}
                    className="flex flex-col gap-5 p-6 lg:flex-row lg:items-center lg:justify-between"
                  >

                    {/* Product */}

                    <div className="flex items-center gap-4">

                      {product?.image ? (
                        <img
                          src={product.image}
                          alt={
                            product.name ||
                            "Product"
                          }
                          className="h-20 w-20 rounded-2xl object-cover"
                        />
                      ) : (
                        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-100">
                          <Package
                            size={25}
                            className="text-slate-400"
                          />
                        </div>
                      )}

                      <div>

                        <h3 className="font-semibold text-slate-900">
                          {product?.name ||
                            "Product Order"}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          Order #
                          {farmerOrder.order_id
                            ?.slice(0, 8)}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          {firstItem?.quantity || 0}{" "}
                          unit
                          {firstItem?.quantity !== 1
                            ? "s"
                            : ""}
                        </p>

                      </div>
                    </div>


                    {/* Order Information */}

                    <div className="flex flex-wrap items-center gap-6">

                      <div>
                        <p className="text-xs text-slate-400">
                          Customer
                        </p>

                        <p className="font-medium text-slate-900">
                          {order?.buyer_id
                            ?.slice(0, 8) ||
                            "Customer"}
                        </p>
                      </div>


                      <div>
                        <p className="text-xs text-slate-400">
                          Your Earnings
                        </p>

                        <p className="font-bold text-emerald-600">
                          ₦
                          {Number(
                            farmerOrder.farmer_amount ||
                              0
                          ).toLocaleString()}
                        </p>
                      </div>


                      <div>
                        <p className="text-xs text-slate-400">
                          Status
                        </p>

                        <span
                          className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                            farmerOrder.status ===
                            "delivered"
                              ? "bg-emerald-100 text-emerald-700"
                              : farmerOrder.status ===
                                "processing"
                              ? "bg-blue-100 text-blue-700"
                              : farmerOrder.status ===
                                "shipped"
                              ? "bg-purple-100 text-purple-700"
                              : farmerOrder.status ===
                                "cancelled"
                              ? "bg-red-100 text-red-700"
                              : "bg-orange-100 text-orange-700"
                          }`}
                        >
                          {farmerOrder.status ||
                            "pending"}
                        </span>
                      </div>


                      {/* View Order */}

                      <Link
                        to={`/farmer/orders/${farmerOrder.id}`}
                        className="inline-flex items-center gap-2 rounded-xl border border-emerald-600 px-4 py-2 font-semibold text-emerald-600 transition hover:bg-emerald-50"
                      >
                        View Order
                        <ArrowRight size={17} />
                      </Link>

                    </div>

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