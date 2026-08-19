import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import { supabase } from "../../lib/supabase";
import ProductCard from "../../components/cards/ProductCard";

const FarmerProfile = () => {
  const { id } = useParams();

  const [farmer, setFarmer] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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
