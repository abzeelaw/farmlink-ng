
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
  getFarmerProductsSold,
} from "../../services/farmerService";

import {
  getFarmerOrders,
} from "../../services/orderService";


const FarmerDashboard = () => {

  const { user } = useAuth();

  const [farmer, setFarmer] =
    useState(null);

  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    productsSold: 0,
    pendingOrders: 0,
  });

  const [recentOrders, setRecentOrders] =
    useState([]);

  const [loading, setLoading] =
    useState(true);


  /* =====================================================
     LOAD DASHBOARD
  ===================================================== */

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

          getFarmerProfile(
            user.id
          ),

          getFarmerDashboardStats(
            user.id
          ),

          /*
            IMPORTANT:
            Use the same order service
            as FarmerOrders.jsx.
          */

          getFarmerOrders(
            user.id
          ),

          getFarmerProductsSold(
            user.id
          ),

        ]);


        setFarmer(
          farmerProfile
        );


        setStats({
          ...dashboardStats,
          productsSold,
        });


        /*
          The order service returns orders
          newest first.

          We only show the first 5
          on the dashboard.
        */

        setRecentOrders(
          farmerOrders.slice(0, 5)
        );

      } catch (error) {

        console.error(
          "FAILED TO LOAD FARMER DASHBOARD:",
          error
        );

      } finally {

        setLoading(false);

      }

    };


    loadDashboard();

  }, [user?.id]);


  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {

    return (
      <section className="min-h-screen bg-slate-50 py-10">

        <div className="container-width">

          <div className="rounded-3xl bg-white p-10 text-center shadow-sm">

            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />

            <p className="mt-4 text-slate-500">
              Loading your dashboard...
            </p>

          </div>

        </div>

      </section>
    );
  }


  const farmerName =
    farmer?.full_name ||
    user?.user_metadata?.full_name ||
    "Farmer";


  /* =====================================================
     DASHBOARD
  ===================================================== */

  return (

    <section className="min-h-screen bg-slate-50 py-10">

      <div className="container-width">


        {/* =================================================
            WELCOME HEADER
        ================================================= */}

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

                Welcome back,{" "}
                {farmerName} 👋

              </h1>


              <p className="mt-2 text-slate-500">
                Manage your products, orders,
                sales, and earnings from one
                place.
              </p>

            </div>


            <Link
              to="/farmer/products"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700"
            >

              Manage Products

              <ArrowRight
                size={18}
              />

            </Link>

          </div>

        </div>


        {/* =================================================
            STATISTICS
        ================================================= */}

        <div className="mb-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">


          {/* TOTAL SALES */}

          <div className="rounded-2xl bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm font-medium text-slate-500">
                  Total Sales
                </p>

                <h2 className="mt-2 text-2xl font-bold text-slate-900">

                  ₦
                  {Number(
                    stats.totalSales ||
                      0
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


          {/* TOTAL ORDERS */}

          <div className="rounded-2xl bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm font-medium text-slate-500">
                  Total Orders
                </p>

                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                  {stats.totalOrders ||
                    0}
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


          {/* PRODUCTS SOLD */}

          <div className="rounded-2xl bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm font-medium text-slate-500">
                  Products Sold
                </p>

                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                  {stats.productsSold ||
                    0}
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


          {/* PENDING ORDERS */}

          <div className="rounded-2xl bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm font-medium text-slate-500">
                  Pending Orders
                </p>

                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                  {stats.pendingOrders ||
                    0}
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


        {/* =================================================
            RECENT ORDERS
        ================================================= */}

        <div className="rounded-3xl bg-white shadow-sm">


          {/* HEADER */}

          <div className="flex flex-col gap-3 border-b border-slate-100 p-6 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <h2 className="text-2xl font-bold text-slate-900">
                Recent Orders
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Orders containing your
                products.
              </p>

            </div>


            <Link
              to="/farmer/orders"
              className="inline-flex items-center gap-2 font-semibold text-emerald-600 hover:text-emerald-700"
            >

              View All Orders

              <ArrowRight
                size={18}
              />

            </Link>

          </div>


          {/* EMPTY STATE */}

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
                Orders containing your
                products will appear here.
              </p>

            </div>

          ) : (

            <div className="divide-y divide-slate-100">

              {recentOrders.map((order) => (

                <div
                  key={order.farmer_order_id}
                  className="flex flex-col gap-5 p-6 lg:flex-row lg:items-center lg:justify-between"
                >


                    {/* PRODUCT */}

                    <div className="flex items-center gap-4">

                      {order.items && order.items[0]?.product_image ? (

                        <img
                          src={order.items[0].product_image}
                          alt={order.items[0].product_name}
                          className="h-20 w-20 rounded-2xl object-cover"
                        />

                      ) : (

                        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-100">

                          <Package size={25} className="text-slate-400" />

                        </div>

                      )}


                      <div>

                        <h3 className="font-semibold text-slate-900">
                          {order.items && order.items[0]?.product_name
                            ? order.items[0].product_name
                            : "Product Order"}
                        </h3>


                        <p className="mt-1 text-sm text-slate-500">
                          Order #{order.order_id?.slice(0, 8)}
                        </p>


                        <p className="mt-1 text-sm text-slate-500">
                          {order.items
                            ? order.items.reduce(
                                (sum, it) => sum + Number(it.quantity || 0),
                                0
                              )
                            : 0} units

                        </p>

                      </div>

                    </div>


                    {/* ORDER INFORMATION */}

                    <div className="flex flex-wrap items-center gap-6">


                      {/* CUSTOMER */}

                      <div>

                        <p className="text-xs text-slate-400">
                          Customer
                        </p>

                        <p className="font-medium text-slate-900">

                          {order.buyer_id
                            ? order.buyer_id.slice(
                                0,
                                8
                              )
                            : "Customer"}

                        </p>

                      </div>


                      {/* EARNINGS */}

                      <div>

                        <p className="text-xs text-slate-400">
                          Your Earnings
                        </p>

                        <p className="font-bold text-emerald-600">

                          ₦
                          {Number(
                            order.farmer_amount ||
                              0
                          ).toLocaleString()}

                        </p>

                      </div>


                      {/* STATUS */}

                      <div>

                        <p className="text-xs text-slate-400">Status</p>

                        <span className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                            order.status === "delivered"
                              ? "bg-emerald-100 text-emerald-700"
                              : order.status === "processing"
                              ? "bg-blue-100 text-blue-700"
                              : order.status === "shipped"
                              ? "bg-purple-100 text-purple-700"
                              : order.status === "cancelled"
                              ? "bg-red-100 text-red-700"
                              : "bg-orange-100 text-orange-700"
                          }`}>{order.status || "pending"}</span>

                      </div>

                      {/* PAYMENT STATUS */}

                      <div>

                        <p className="text-xs text-slate-400">Payment</p>

                        <span className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                            order.payment_status === "paid"
                              ? "bg-emerald-100 text-emerald-700"
                              : order.payment_status === "failed"
                              ? "bg-red-100 text-red-700"
                              : "bg-orange-100 text-orange-700"
                          }`}>{order.payment_status || "pending"}</span>

                      </div>


                      {/* VIEW */}

                      <Link
                        to="/farmer/orders"
                        className="inline-flex items-center gap-2 rounded-xl border border-emerald-600 px-4 py-2 font-semibold text-emerald-600 transition hover:bg-emerald-50"
                      >

                        View Orders

                        <ArrowRight
                          size={17}
                        />

                      </Link>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </div>

      </div>

    </section>
  );
};

export default FarmerDashboard;
