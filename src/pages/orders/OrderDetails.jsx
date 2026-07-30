import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";

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

        // Make sure the customer can only view their own order
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

  // Loading state
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

  // Order not found
  if (!order) {
    return (
      <section className="section-padding">
        <div className="container-width">
          <h1 className="text-3xl font-bold text-slate-900">
            Order not found
          </h1>

          <p className="mt-2 text-slate-500">
            We could not find the order you are looking for.
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

        {/* Header */}
        <div className="mb-10">
          <Link
            to="/orders"
            className="font-medium text-emerald-600 hover:underline"
          >
            ← Back to Orders
          </Link>

          <h1 className="mt-5 text-4xl font-bold text-slate-900">
            Order Details
          </h1>

          <p className="mt-2 text-slate-500">
            Order ID: {order.id}
          </p>

          <p className="mt-1 text-sm text-slate-400">
            Placed on{" "}
            {new Date(order.created_at).toLocaleDateString()}
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">

          {/* ============================= */}
          {/* ORDER ITEMS */}
          {/* ============================= */}

          <div className="lg:col-span-2">
            <div className="rounded-3xl bg-white p-8 shadow-sm">

              <h2 className="mb-6 text-2xl font-bold text-slate-900">
                Order Items
              </h2>

              <div className="space-y-6">

                {items.length === 0 ? (
                  <p className="text-slate-500">
                    No items found for this order.
                  </p>
                ) : (
                  items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 border-b border-slate-100 pb-6 last:border-none last:pb-0"
                    >

                      {/* Product Image */}
                      <div className="shrink-0">
                        {item.products?.image ? (
                          <img
                            src={item.products.image}
                            alt={
                              item.products?.name ||
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
                          {item.products?.name ||
                            `Product #${item.product_id}`}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          Quantity: {item.quantity}
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

          {/* ============================= */}
          {/* ORDER SUMMARY */}
          {/* ============================= */}

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
                    {order.order_status || "pending"}
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