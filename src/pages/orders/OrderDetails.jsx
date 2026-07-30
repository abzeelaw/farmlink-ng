import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Check,
  Clock,
  Package,
  Truck,
  CircleCheck,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import {
  getOrderById,
  getOrderItems,
} from "../../services/orderService";

const OrderDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrder = async () => {
      if (!user || !id) {
        setLoading(false);
        return;
      }

      try {
        const orderData = await getOrderById(id);

        // Customer can only view their own order
        if (orderData.buyer_id !== user.id) {
          throw new Error("You cannot view this order.");
        }

        const itemsData = await getOrderItems(id);

        setOrder(orderData);
        setItems(itemsData);
      } catch (error) {
        console.error("Error loading order:", error);

        toast.error(
          error.message || "Failed to load order."
        );
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [id, user]);

  // -----------------------------------------
  // STATUS CONFIGURATION
  // -----------------------------------------

  const statusSteps = [
    {
      key: "pending",
      label: "Order Placed",
      description:
        "Your order has been received.",
      icon: Clock,
    },
    {
      key: "processing",
      label: "Processing",
      description:
        "The farmer is preparing your order.",
      icon: Package,
    },
    {
      key: "shipped",
      label: "Out for Delivery",
      description:
        "Your order is on its way to you.",
      icon: Truck,
    },
    {
      key: "delivered",
      label: "Delivered",
      description:
        "Your order has been delivered.",
      icon: CircleCheck,
    },
  ];

  const statusOrder = [
    "pending",
    "processing",
    "shipped",
    "delivered",
  ];

  const currentStatus =
    order?.order_status || "pending";

  const currentStatusIndex =
    statusOrder.indexOf(currentStatus);

  // -----------------------------------------
  // LOADING
  // -----------------------------------------

  if (loading) {
    return (
      <section className="section-padding">
        <div className="container-width">
          <p className="text-slate-500">
            Loading order...
          </p>
        </div>
      </section>
    );
  }

  // -----------------------------------------
  // ORDER NOT FOUND
  // -----------------------------------------

  if (!order) {
    return (
      <section className="section-padding">
        <div className="container-width">
          <h1 className="text-3xl font-bold text-slate-900">
            Order not found
          </h1>

          <p className="mt-2 text-slate-500">
            We could not find the order you are
            looking for.
          </p>

          <Link
            to="/orders"
            className="mt-6 inline-block font-semibold text-emerald-600 hover:underline"
          >
            ← Back to Orders
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding bg-slate-50">
      <div className="container-width">

        {/* -------------------------------- */}
        {/* HEADER */}
        {/* -------------------------------- */}

        <div className="mb-10">
          <Link
            to="/orders"
            className="font-medium text-emerald-600 hover:underline"
          >
            ← Back to Orders
          </Link>

          <div className="mt-5 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h1 className="text-4xl font-bold text-slate-900">
                Order Details
              </h1>

              <p className="mt-2 break-all text-sm text-slate-500">
                Order ID: {order.id}
              </p>

              <p className="mt-1 text-sm text-slate-400">
                Placed on{" "}
                {new Date(
                  order.created_at
                ).toLocaleDateString()}
              </p>
            </div>

            {/* Current Status */}
            <span className="w-fit rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold capitalize text-emerald-700">
              {currentStatus}
            </span>
          </div>
        </div>

        {/* -------------------------------- */}
        {/* ORDER STATUS TIMELINE */}
        {/* -------------------------------- */}

        <div className="mb-8 rounded-3xl bg-white p-8 shadow-sm">
          <h2 className="mb-8 text-2xl font-bold text-slate-900">
            Order Progress
          </h2>

          <div className="relative">
            {statusSteps.map(
              (step, index) => {
                const StepIcon = step.icon;

                const isCompleted =
                  index <= currentStatusIndex;

                const isCurrent =
                  index === currentStatusIndex;

                const isLast =
                  index ===
                  statusSteps.length - 1;

                return (
                  <div
                    key={step.key}
                    className="relative flex gap-5"
                  >
                    {/* Connector */}
                    {!isLast && (
                      <div
                        className={`absolute left-5 top-10 h-full w-0.5 ${
                          index <
                          currentStatusIndex
                            ? "bg-emerald-500"
                            : "bg-slate-200"
                        }`}
                      />
                    )}

                    {/* Icon */}
                    <div
                      className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                        isCompleted
                          ? "bg-emerald-600 text-white"
                          : "bg-slate-100 text-slate-400"
                      } ${
                        isCurrent
                          ? "ring-4 ring-emerald-100"
                          : ""
                      }`}
                    >
                      {index <
                      currentStatusIndex ? (
                        <Check size={20} />
                      ) : (
                        <StepIcon size={20} />
                      )}
                    </div>

                    {/* Content */}
                    <div
                      className={`pb-8 ${
                        isLast
                          ? "pb-0"
                          : ""
                      }`}
                    >
                      <h3
                        className={`font-semibold ${
                          isCompleted
                            ? "text-slate-900"
                            : "text-slate-400"
                        }`}
                      >
                        {step.label}
                      </h3>

                      <p
                        className={`mt-1 text-sm ${
                          isCompleted
                            ? "text-slate-500"
                            : "text-slate-400"
                        }`}
                      >
                        {step.description}
                      </p>

                      {isCurrent && (
                        <span className="mt-2 inline-block text-xs font-semibold uppercase tracking-wide text-emerald-600">
                          Current status
                        </span>
                      )}
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">

          {/* -------------------------------- */}
          {/* ORDER ITEMS */}
          {/* -------------------------------- */}

          <div className="lg:col-span-2">
            <div className="rounded-3xl bg-white p-8 shadow-sm">

              <h2 className="mb-6 text-2xl font-bold text-slate-900">
                Order Items
              </h2>

              <div className="space-y-6">

                {items.length === 0 ? (
                  <p className="text-slate-500">
                    No items found for this
                    order.
                  </p>
                ) : (
                  items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 border-b border-slate-100 pb-6 last:border-none last:pb-0"
                    >

                      {/* Product Image */}
                      <div className="shrink-0">
                        {item.products
                          ?.image ? (
                          <img
                            src={
                              item.products
                                .image
                            }
                            alt={
                              item.products
                                ?.name ||
                              "Product"
                            }
                            className="h-24 w-24 rounded-2xl object-cover"
                          />
                        ) : (
                          <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-slate-100 text-xs text-slate-400">
                            No Image
                          </div>
                        )}
                      </div>

                      {/* Product Information */}
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-slate-900">
                          {item.products
                            ?.name ||
                            `Product #${item.product_id}`}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          Quantity:{" "}
                          {item.quantity}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          Unit price: ₦
                          {Number(
                            item.unit_price
                          ).toLocaleString()}
                        </p>
                      </div>

                      {/* Subtotal */}
                      <div className="text-right">
                        <p className="font-bold text-emerald-600">
                          ₦
                          {Number(
                            item.subtotal
                          ).toLocaleString()}
                        </p>
                      </div>

                    </div>
                  ))
                )}

              </div>
            </div>
          </div>

          {/* -------------------------------- */}
          {/* ORDER SUMMARY */}
          {/* -------------------------------- */}

          <div>
            <div className="rounded-3xl bg-white p-8 shadow-sm">

              <h2 className="mb-6 text-2xl font-bold text-slate-900">
                Order Summary
              </h2>

              <div className="space-y-6">

                {/* Payment Status */}
                <div>
                  <p className="text-sm text-slate-500">
                    Payment Status
                  </p>

                  <span className="mt-1 inline-block rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold capitalize text-emerald-700">
                    {order.payment_status}
                  </span>
                </div>

                {/* Order Status */}
                <div>
                  <p className="text-sm text-slate-500">
                    Order Status
                  </p>

                  <span className="mt-1 inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold capitalize text-blue-700">
                    {currentStatus}
                  </span>
                </div>

                {/* Payment Reference */}
                <div>
                  <p className="text-sm text-slate-500">
                    Payment Reference
                  </p>

                  <p className="mt-1 break-all font-medium text-slate-900">
                    {order.payment_reference ||
                      "Not available"}
                  </p>
                </div>

                {/* Delivery Address */}
                <div>
                  <p className="text-sm text-slate-500">
                    Delivery Address
                  </p>

                  <p className="mt-1 font-medium text-slate-900">
                    {order.delivery_address}
                  </p>
                </div>

                {/* Location */}
                <div>
                  <p className="text-sm text-slate-500">
                    Location
                  </p>

                  <p className="mt-1 font-medium text-slate-900">
                    {order.delivery_city},{" "}
                    {order.delivery_state}
                  </p>
                </div>

                {/* Phone */}
                <div>
                  <p className="text-sm text-slate-500">
                    Phone
                  </p>

                  <p className="mt-1 font-medium text-slate-900">
                    {order.phone}
                  </p>
                </div>

                {/* Notes */}
                {order.notes && (
                  <div>
                    <p className="text-sm text-slate-500">
                      Delivery Notes
                    </p>

                    <p className="mt-1 font-medium text-slate-900">
                      {order.notes}
                    </p>
                  </div>
                )}

                <hr />

                {/* Total */}
                <div className="flex items-center justify-between text-xl font-bold">
                  <span>Total</span>

                  <span className="text-emerald-600">
                    ₦
                    {Number(
                      order.total_amount
                    ).toLocaleString()}
                  </span>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default OrderDetails;
