import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../../context/AuthContext";
import { getBuyerOrders } from "../../services/orderService";
import { supabase } from "../../lib/supabase";

const MyOrders = () => {
  const { user, loading: authLoading } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      // Wait until AuthContext finishes checking the session
      if (authLoading) return;

      // No logged-in user
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const data = await getBuyerOrders(user.id);

        setOrders(data || []);
      } catch (error) {
        console.error("Error loading orders:", error);

        toast.error(
          error.message || "Failed to load orders."
        );
      } finally {
        setLoading(false);
      }
    };

    loadOrders();

    // Subscribe to updates on orders for this buyer so status updates
    // are reflected in real time.
    let channel;

    if (user?.id) {
      channel = supabase
        .channel(`buyer_orders:${user.id}`)
        .on(
          "postgres_changes",
          { event: "UPDATE", schema: "public", table: "orders", filter: `buyer_id=eq.${user.id}` },
          (payload) => {
            if (payload?.new) {
              setOrders((current) =>
                current.map((o) => (o.id === payload.new.id ? { ...o, ...payload.new } : o))
              );
            }
          }
        )
        .subscribe();
    }

    return () => {
      if (channel) {
        try {
          channel.unsubscribe();
        } catch {
          // ignore
        }
      }
    };
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <section className="section-padding">
        <div className="container-width">
          <h1 className="text-3xl font-bold">
            Loading your orders...
          </h1>
        </div>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="section-padding">
        <div className="container-width">
          <h1 className="text-3xl font-bold">
            Please log in
          </h1>

          <p className="mt-2 text-slate-500">
            You need to be logged in to view your orders.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding bg-slate-50">
      <div className="container-width">

        <div className="mb-10">
          <h1 className="text-4xl font-bold">
            My Orders
          </h1>

          <p className="mt-2 text-slate-500">
            View and track your orders.
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
            <h2 className="text-2xl font-bold">
              No orders yet
            </h2>

            <p className="mt-2 text-slate-500">
              Your completed orders will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-3xl bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                  <div>
                    <p className="text-sm text-slate-500">
                      Order
                    </p>

                    <h2 className="font-bold">
                      #{order.id}
                    </h2>

                    <p className="mt-1 text-sm text-slate-400">
                      {new Date(
                        order.created_at
                      ).toLocaleDateString()}
                    </p>
                  </div>

                  <div>
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold capitalize text-blue-700">
                      {order.order_status || "pending"}
                    </span>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">
                      Total
                    </p>

                    <p className="text-xl font-bold text-emerald-600">
                      ₦
                      {Number(
                        order.total_amount
                      ).toLocaleString()}
                    </p>
                  </div>

                  <Link
                    to={`/orders/${order.id}`}
                    className="rounded-xl bg-emerald-600 px-5 py-3 text-center font-semibold text-white transition hover:bg-emerald-700"
                  >
                    View Order
                  </Link>

                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

export default MyOrders;