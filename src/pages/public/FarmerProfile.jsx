import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import { supabase } from "../../lib/supabase";
import ProductCard from "../../components/cards/ProductCard";
import { useAuth } from "../../context/AuthContext";
import { getAllFarmerOrders } from "../../services/farmerService";

const FarmerProfile = () => {
  const { id } = useParams();

  const [farmer, setFarmer] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [showOrders, setShowOrders] = useState(false);

  const { user, profile } = useAuth();

  useEffect(() => {
    const load = async () => {
      if (!id) return;

      try {
        setLoading(true);

        const { data: profile, error: profileErr } = await supabase
          .from("profiles")
          .select(`
            id,
            full_name,
            avatar_url,
            farm_name,
            farm_description,
            state,
            city,
            farm_image,
            verification_status,
            rating,
            total_sales,
            phone,
            email
          `)
          .eq("id", id)
          .single();

        if (profileErr) {
          console.error("Failed to load farmer profile:", profileErr);
        } else {
          setFarmer(profile);
        }

        const { data: prods, error: prodsErr } = await supabase
          .from("products")
          .select("id, name, price, image, stock, state, city")
          .eq("farmer_id", id)
          .order("created_at", { ascending: false });

        if (!prodsErr) setProducts(prods || []);
      } catch (err) {
        console.error("Error loading farm profile:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const viewerIsOwner = user?.id === farmer?.id;
  const viewerIsAdmin = profile?.role === "admin";

  const fetchOrders = async () => {
    if (!id) return;

    try {
      const data = await getAllFarmerOrders(id);
      setOrders(data || []);
    } catch (err) {
      console.error("Failed to load farmer orders:", err);
    }
  };

  if (loading) return <div className="container-width section-padding">Loading...</div>;

  if (!farmer) return <div className="container-width section-padding">Farmer not found.</div>;

  return (
    <section className="section-padding bg-slate-50">
      <div className="container-width">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
            <div className="h-48 w-48 overflow-hidden rounded-2xl bg-slate-100">
              {farmer.farm_image ? (
                <img src={farmer.farm_image} alt={farmer.farm_name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-slate-400">No image</div>
              )}
            </div>

            <div>
              <h1 className="text-3xl font-bold text-slate-900">{farmer.full_name}</h1>
              <p className="mt-1 text-sm font-medium text-emerald-600">{farmer.farm_name}</p>
              <p className="mt-3 text-slate-600">{farmer.farm_description}</p>

              <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-600">
                <div>{farmer.city}, {farmer.state}</div>
                {farmer.phone && <div>Phone: {farmer.phone}</div>}
                {farmer.email && <div>Email: {farmer.email}</div>}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold text-slate-900">Products by {farmer.farm_name || farmer.full_name}</h2>

            <div className="mt-4 flex gap-3">
            {(viewerIsOwner || viewerIsAdmin) && (
              <>
                {/* Only allow managing/adding products if verified (or admin) */}
                <Link to={viewerIsOwner ? "/farmer/products" : "/farmer/add-product"} className="rounded-xl bg-emerald-600 px-4 py-2 text-white">
                  {(viewerIsAdmin || (viewerIsOwner && profile?.verification_status === 'verified')) ? 'Manage / Add Product' : 'Products'}
                </Link>

                    {viewerIsOwner && (
                      <Link to="/farmer/profile" className="rounded-xl border border-slate-200 px-4 py-2">
                        Edit Profile
                      </Link>
                    )}

                    {/* Admin can edit any farmer via query param */}
                    {viewerIsAdmin && (
                      <Link to={`/farmer/profile?id=${farmer.id}`} className="rounded-xl border border-slate-200 px-4 py-2">
                        Edit Profile
                      </Link>
                    )}

                <button
                  onClick={async () => {
                    setShowOrders((s) => !s);
                    if (!showOrders) await fetchOrders();
                  }}
                  className="rounded-xl border border-emerald-600 px-4 py-2 text-emerald-600"
                >
                  {showOrders ? "Hide Orders" : "View Orders"}
                </button>
              </>
            )}
          </div>

              {viewerIsAdmin && farmer?.farm_name === "AKI INTEGRATED FARMS LTD" && (
                <div className="mt-4">
                  <button
                    onClick={async () => {
                      if (!confirm("Copy AKI Integrated Farms content to all farmers? This will overwrite farm name, description, state, city and image.")) return;

                      try {
                        const updateFields = {
                          farm_name: farmer.farm_name,
                          farm_description: farmer.farm_description,
                          state: farmer.state,
                          city: farmer.city,
                          farm_image: farmer.farm_image,
                        };

                        const { error } = await supabase
                          .from('profiles')
                          .update(updateFields)
                          .neq('id', farmer.id)
                          .eq('role', 'farmer');

                        if (error) throw error;

                        alert('Copied AKI content to other farmers.');
                      } catch (err) {
                        console.error('Copy failed:', err);
                        alert('Copy failed: ' + (err.message || err));
                      }
                    }}
                    className="mt-2 rounded-xl bg-amber-500 px-4 py-2 text-white"
                  >
                    Copy AKI content to all farmers
                  </button>
                </div>
              )}

          {showOrders && (
            <div className="mt-8 rounded-3xl bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold">Orders containing this farmer's products</h3>

              {orders.length === 0 ? (
                <p className="mt-4 text-slate-500">No orders yet.</p>
              ) : (
                <div className="mt-4 divide-y divide-slate-100">
                  {orders.map((order) => (
                    <div key={order.farmer_order_id} className="flex items-center justify-between gap-4 p-4">
                      <div>
                        <div className="font-semibold">Order #{order.order_id?.slice(0,8)}</div>
                        <div className="text-sm text-slate-500">{order.items?.length || 0} items • ₦{Number(order.farmer_amount||0).toLocaleString()}</div>
                      </div>

                      <div className="text-sm">
                        <div className="mb-1">Status: <span className="font-medium">{order.status}</span></div>
                        <div>Payment: <span className="font-medium">{order.payment_status}</span></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {products.length === 0 ? (
            <p className="mt-4 text-slate-500">No products available from this farmer.</p>
          ) : (
            <div className="mt-4 grid gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>

        <div className="mt-8">
          <Link to="/farmers" className="text-emerald-600 hover:underline">← Back to farmers</Link>
        </div>
      </div>
    </section>
  );
};

export default FarmerProfile;
