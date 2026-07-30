import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { useAuth } from "../../context/AuthContext";

import {
  getFarmerOrders,
  updateOrderStatus,
} from "../../services/orderService";

const FarmerOrders = () => {
  const { user } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    const loadOrders = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const data = await getFarmerOrders(user.id);

        setOrders(data || []);
      } catch (error) {
        console.error(error);

        toast.error(
          error.message || "Failed to load orders."
        );
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [user]);

  const handleStatusChange = async (
    orderId,
    newStatus
  ) => {
    try {
      setUpdating(orderId);

      await updateOrderStatus(
        orderId,
        newStatus
      );

      setOrders((currentOrders) =>
        currentOrders.map((item) => {
          if (item.orders?.id === orderId) {
            return {
              ...item,
              orders: {
                ...item.orders,
                order_status: newStatus,
              },
            };
          }

          return item;
        })
      );

      toast.success("Order status updated.");
    } catch (error) {
      console.error(error);

      toast.error(
        error.message ||
          "Failed to update order status."
      );
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <section className="section-padding">
        <div className="container-width">
          <p className="text-slate-500">
            Loading orders...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding bg-slate-50">
      <div className="container-width">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-slate-900">
            Farmer Orders
          </h1>

          <p className="mt-2 text-slate-500">
            Manage orders containing your products.
          </p>
        </div>

        {/* Empty State */}
        {orders.length === 0 ? (
          <div className="rounded-3xl bg-white p-12 text-center shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">
              No Orders Yet
            </h2>

            <p className="mt-2 text-slate-500">
              Orders containing your products will
              appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-6">

            {orders.map((item) => {
              const order = item.orders;
              const product = item.products;

              return (
                <div
                  key={item.id}
                  className="rounded-3xl bg-white p-6 shadow-sm"
                >

                  {/* Order Header */}
                  <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 md:flex-row md:items-center md:justify-between">

                    <div>
                      <p className="text-sm text-slate-500">
                        Order ID
                      </p>

                      <h2 className="font-bold text-slate-900">
                        #{order?.id}
                      </h2>

                      <p className="mt-1 text-sm text-slate-400">
                        {order?.created_at
                          ? new Date(
                              order.created_at
                            ).toLocaleDateString()
                          : ""}
                      </p>
                    </div>

                    {/* Status */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-600">
                        Order Status
                      </label>

                      <select
                        value={
                          order?.order_status ||
                          "pending"
                        }
                        disabled={
                          updating === order?.id
                        }
                        onChange={(e) =>
                          handleStatusChange(
                            order.id,
                            e.target.value
                          )
                        }
                        className="rounded-xl border border-slate-300 bg-white px-4 py-2 outline-none focus:border-emerald-500"
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

                  {/* Product + Customer */}
                  <div className="mt-6 grid gap-8 lg:grid-cols-2">

                    {/* Product */}
                    <div>
                      <h3 className="mb-4 font-semibold text-slate-900">
                        Your Product
                      </h3>

                      <div className="flex gap-4">

                        {product?.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-20 w-20 rounded-xl object-cover"
                          />
                        ) : (
                          <div className="h-20 w-20 rounded-xl bg-slate-100" />
                        )}

                        <div>
                          <h4 className="font-semibold">
                            {product?.name ||
                              "Product"}
                          </h4>

                          <p className="mt-1 text-sm text-slate-500">
                            Quantity: {item.quantity}
                          </p>

                          <p className="text-sm text-slate-500">
                            Unit Price: ₦
                            {Number(
                              item.unit_price
                            ).toLocaleString()}
                          </p>

                          <p className="mt-1 font-bold text-emerald-600">
                            Subtotal: ₦
                            {Number(
                              item.subtotal
                            ).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Customer */}
                    <div>
                      <h3 className="mb-4 font-semibold text-slate-900">
                        Delivery Information
                      </h3>

                      <div className="space-y-2 text-sm">

                        <p>
                          <span className="font-medium">
                            Address:
                          </span>{" "}
                          {order?.delivery_address}
                        </p>

                        <p>
                          <span className="font-medium">
                            Location:
                          </span>{" "}
                          {order?.delivery_city},{" "}
                          {order?.delivery_state}
                        </p>

                        <p>
                          <span className="font-medium">
                            Phone:
                          </span>{" "}
                          {order?.phone}
                        </p>

                        {order?.notes && (
                          <p>
                            <span className="font-medium">
                              Notes:
                            </span>{" "}
                            {order.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Payment */}
                  <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-5 md:flex-row md:items-center md:justify-between">

                    <div>
                      <span className="text-sm text-slate-500">
                        Payment Status
                      </span>

                      <p className="font-semibold capitalize text-emerald-600">
                        {order?.payment_status ||
                          "Pending"}
                      </p>
                    </div>

                    <div>
                      <span className="text-sm text-slate-500">
                        Order Total
                      </span>

                      <p className="text-xl font-bold text-slate-900">
                        ₦
                        {Number(
                          order?.total_amount || 0
                        ).toLocaleString()}
                      </p>
                    </div>

                  </div>

                </div>
              );
            })}

          </div>
        )}

      </div>
    </section>
  );
};

export default FarmerOrders;