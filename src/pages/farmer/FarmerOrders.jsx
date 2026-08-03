import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  Package,
  MapPin,
  Phone,
  CreditCard,
  Calendar,
  User,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

import {
  getFarmerOrders,
  updateFarmerOrderStatus,
} from "../../services/orderService";


const FarmerOrders = () => {
  const { user } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);


  /* =========================================================
     LOAD FARMER ORDERS
  ========================================================= */

  const loadOrders = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const data =
        await getFarmerOrders(user.id);

      console.log(
        "FARMER ORDERS PAGE DATA:",
        data
      );

      setOrders(data || []);
    } catch (error) {
      console.error(
        "FAILED TO LOAD FARMER ORDERS:",
        error
      );

      toast.error(
        error.message ||
          "Failed to load farmer orders."
      );
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadOrders();
  }, [user]);


  /* =========================================================
     UPDATE ORDER STATUS
  ========================================================= */

  const handleStatusChange = async (
    farmerOrderId,
    newStatus
  ) => {
    if (!user?.id) {
      toast.error(
        "You must be logged in."
      );

      return;
    }

    try {
      setUpdating(farmerOrderId);

      await updateFarmerOrderStatus(
        farmerOrderId,
        user.id,
        newStatus
      );

      /*
        Update every row belonging to the
        same farmer order.

        This is important because one farmer
        order can contain multiple products.
      */

      setOrders((currentOrders) =>
        currentOrders.map((item) =>
          item.farmer_order_id ===
          farmerOrderId
            ? {
                ...item,
                status: newStatus,
              }
            : item
        )
      );

      toast.success(
        "Order status updated successfully."
      );
    } catch (error) {
      console.error(
        "STATUS UPDATE ERROR:",
        error
      );

      toast.error(
        error.message ||
          "Failed to update order status."
      );
    } finally {
      setUpdating(null);
    }
  };


  /* =========================================================
     LOADING STATE
  ========================================================= */

  if (loading) {
    return (
      <section className="min-h-screen bg-slate-50 py-10">
        <div className="container-width">

          <div className="rounded-3xl bg-white p-12 text-center shadow-sm">

            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600" />

            <p className="text-slate-500">
              Loading your orders...
            </p>

          </div>

        </div>
      </section>
    );
  }


  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <section className="min-h-screen bg-slate-50 py-10">

      <div className="container-width">

        {/* =====================================================
            PAGE HEADER
        ===================================================== */}

        <div className="mb-10">

          <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
            Farmer Orders
          </h1>

          <p className="mt-2 text-slate-500">
            Manage orders containing your products.
          </p>

        </div>


        {/* =====================================================
            EMPTY STATE
        ===================================================== */}

        {orders.length === 0 ? (

          <div className="rounded-3xl bg-white p-12 text-center shadow-sm">

            <Package
              size={55}
              className="mx-auto text-slate-300"
            />

            <h2 className="mt-5 text-2xl font-bold text-slate-900">
              No Orders Yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-slate-500">
              Orders containing your products
              will appear here when customers
              purchase from you.
            </p>

          </div>

        ) : (

          /* ===================================================
             ORDERS
          =================================================== */

          <div className="space-y-8">

            {orders.map((order) => (

              <div
                key={order.order_item_id}
                className="overflow-hidden rounded-3xl bg-white shadow-sm"
              >

                {/* =================================================
                    ORDER HEADER
                ================================================= */}

                <div className="border-b border-slate-100 p-6">

                  <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                    {/* ORDER IDS */}

                    <div>

                      <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600">

                        <Package size={18} />

                        <span>
                          Farmer Order
                        </span>

                      </div>


                      <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Farmer Order ID
                      </p>

                      <p className="mt-1 break-all text-sm font-bold text-slate-900">
                        #{order.farmer_order_id}
                      </p>


                      <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Customer Order ID
                      </p>

                      <p className="mt-1 break-all text-sm font-semibold text-slate-700">
                        #{order.order_id}
                      </p>


                      <div className="mt-3 flex items-center gap-2 text-sm text-slate-400">

                        <Calendar size={15} />

                        {order.order_created_at
                          ? new Date(
                              order.order_created_at
                            ).toLocaleString()
                          : "Date unavailable"}

                      </div>

                    </div>


                    {/* STATUS */}

                    <div>

                      <label className="mb-2 block text-sm font-medium text-slate-600">
                        Order Status
                      </label>

                      <select
                        value={
                          order.status ||
                          "pending"
                        }
                        disabled={
                          updating ===
                          order.farmer_order_id
                        }
                        onChange={(e) =>
                          handleStatusChange(
                            order.farmer_order_id,
                            e.target.value
                          )
                        }
                        className="min-w-[210px] rounded-xl border border-slate-300 bg-white px-4 py-3 font-medium text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
                      >

                        <option value="pending">
                          Pending
                        </option>

                        <option value="processing">
                          Processing
                        </option>

                        <option value="ready">
                          Ready
                        </option>

                        <option value="shipped">
                          Shipped
                        </option>

                        <option value="out_for_delivery">
                          Out for Delivery
                        </option>

                        <option value="delivered">
                          Delivered
                        </option>

                        <option value="cancelled">
                          Cancelled
                        </option>

                      </select>

                    </div>

                  </div>

                </div>


                {/* =================================================
                    DELIVERY + ORDER INFORMATION
                ================================================= */}

                <div className="grid gap-8 p-6 lg:grid-cols-2">

                  {/* DELIVERY */}

                  <div>

                    <div className="mb-5 flex items-center gap-2">

                      <MapPin
                        size={20}
                        className="text-emerald-600"
                      />

                      <h3 className="text-lg font-bold text-slate-900">
                        Delivery Information
                      </h3>

                    </div>


                    <div className="space-y-4 rounded-2xl bg-slate-50 p-5">

                      {/* ADDRESS */}

                      <div>

                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Delivery Address
                        </p>

                        <p className="mt-1 font-medium text-slate-800">
                          {order.delivery_address ||
                            "Not provided"}
                        </p>

                      </div>


                      {/* CITY */}

                      <div>

                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          City
                        </p>

                        <p className="mt-1 font-medium text-slate-800">
                          {order.delivery_city ||
                            "Not provided"}
                        </p>

                      </div>


                      {/* STATE */}

                      <div>

                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          State
                        </p>

                        <p className="mt-1 font-medium capitalize text-slate-800">
                          {order.delivery_state ||
                            "Not provided"}
                        </p>

                      </div>


                      {/* PHONE */}

                      <div>

                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Customer Phone
                        </p>

                        <div className="mt-1 flex items-center gap-2 font-medium text-slate-800">

                          <Phone size={16} />

                          {order.phone ||
                            "Not provided"}

                        </div>

                      </div>


                      {/* NOTES */}

                      {order.notes && (
                        <div>

                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Customer Notes
                          </p>

                          <p className="mt-1 text-slate-700">
                            {order.notes}
                          </p>

                        </div>
                      )}

                    </div>

                  </div>


                  {/* ORDER SUMMARY */}

                  <div>

                    <div className="mb-5 flex items-center gap-2">

                      <CreditCard
                        size={20}
                        className="text-emerald-600"
                      />

                      <h3 className="text-lg font-bold text-slate-900">
                        Order Summary
                      </h3>

                    </div>


                    <div className="rounded-2xl bg-slate-50 p-5">

                      <div className="space-y-5">

                        {/* CUSTOMER */}

                        <div>

                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Customer ID
                          </p>

                          <div className="mt-1 flex items-start gap-2">

                            <User
                              size={16}
                              className="mt-1 flex-shrink-0 text-slate-400"
                            />

                            <p className="break-all text-sm font-medium text-slate-800">
                              {order.buyer_id ||
                                "Unavailable"}
                            </p>

                          </div>

                        </div>


                        {/* PAYMENT */}

                        <div>

                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Payment Status
                          </p>

                          <p className="mt-1 font-semibold capitalize text-emerald-600">
                            {order.payment_status ||
                              "Pending"}
                          </p>

                        </div>


                        {/* MASTER ORDER STATUS */}

                        <div>

                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Customer Order Status
                          </p>

                          <p className="mt-1 font-semibold capitalize text-slate-700">
                            {order.order_status ||
                              "Pending"}
                          </p>

                        </div>


                        {/* TOTAL */}

                        <div className="border-t border-slate-200 pt-4">

                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Full Order Total
                          </p>

                          <p className="mt-1 text-2xl font-bold text-slate-900">
                            ₦
                            {Number(
                              order.total_amount ||
                                0
                            ).toLocaleString()}
                          </p>

                        </div>

                      </div>

                    </div>

                  </div>

                </div>


                {/* =================================================
                    PRODUCT ORDERED
                ================================================= */}

                <div className="border-t border-slate-100 p-6">

                  <div className="mb-5">

                    <h3 className="text-lg font-bold text-slate-900">
                      Product Ordered
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Your product included in this order.
                    </p>

                  </div>


                  <div className="rounded-2xl border border-slate-100 p-5">

                    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

                      {/* PRODUCT */}

                      <div className="flex items-center gap-4">

                        {order.product_image ? (

                          <img
                            src={order.product_image}
                            alt={
                              order.product_name ||
                              "Product"
                            }
                            className="h-24 w-24 rounded-2xl object-cover"
                          />

                        ) : (

                          <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-slate-100">

                            <Package
                              size={32}
                              className="text-slate-400"
                            />

                          </div>

                        )}


                        <div>

                          <h4 className="text-lg font-bold text-slate-900">
                            {order.product_name ||
                              "Product"}
                          </h4>

                          <p className="mt-1 text-xs text-slate-400">
                            Product ID
                          </p>

                          <p className="max-w-xs break-all text-xs text-slate-500">
                            {order.product_id}
                          </p>

                        </div>

                      </div>


                      {/* QUANTITY */}

                      <div>

                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Quantity
                        </p>

                        <p className="mt-1 text-lg font-bold text-slate-900">
                          {order.quantity}
                        </p>

                      </div>


                      {/* UNIT PRICE */}

                      <div>

                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Unit Price
                        </p>

                        <p className="mt-1 text-lg font-bold text-slate-900">
                          ₦
                          {Number(
                            order.unit_price ||
                              0
                          ).toLocaleString()}
                        </p>

                      </div>


                      {/* SUBTOTAL */}

                      <div>

                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Subtotal
                        </p>

                        <p className="mt-1 text-xl font-bold text-emerald-600">
                          ₦
                          {Number(
                            order.subtotal ||
                              0
                          ).toLocaleString()}
                        </p>

                      </div>

                    </div>

                  </div>

                </div>


                {/* =================================================
                    FARMER EARNINGS
                ================================================= */}

                <div className="border-t border-slate-100 bg-slate-50 p-6">

                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                    <div>

                      <p className="text-sm text-slate-500">
                        Your Earnings
                      </p>

                      <p className="mt-1 text-2xl font-bold text-emerald-600">
                        ₦
                        {Number(
                          order.farmer_amount ||
                            0
                        ).toLocaleString()}
                      </p>

                    </div>


                    <div>

                      <p className="text-sm text-slate-500">
                        Payout Status
                      </p>

                      <p className="mt-1 font-semibold capitalize text-slate-800">
                        {order.payout_status ||
                          "pending"}
                      </p>

                    </div>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </section>
  );
};

export default FarmerOrders;