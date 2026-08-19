import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { supabase } from "../../lib/supabase";

import SectionHeader from "../../components/common/SectionHeader";
import FarmerCard from "../../components/cards/FarmerCard";
import { Button } from "../../components/ui";

const Farmers = () => {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data, error } = await supabase
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
            total_sales
          `)
          .eq("role", "farmer")
          .eq("verification_status", "verified")
          .order("total_sales", { ascending: false });

        if (error) {
          console.error("Failed to load farmers:", error);
          setFarmers([]);
        } else {
          setFarmers(data || []);
        }
      } catch (err) {
        console.error("Error loading farmers:", err);
        setFarmers([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <section className="section-padding bg-slate-50">
      <div className="container-width">
        <SectionHeader
          badge="Farmers"
          title="All Verified Farmers"
          subtitle="Browse verified farmers and their offerings."
        />

        {loading ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-72 animate-pulse rounded-3xl bg-slate-100" />
            ))}
          </div>
        ) : farmers.length === 0 ? (
          <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
            <h3 className="text-xl font-semibold text-slate-900">No farmers found</h3>
            <p className="mt-2 text-slate-500">Try again later.</p>
          </div>
        ) : (
          <>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {farmers.map((farmer) => (
                <FarmerCard key={farmer.id} farmer={farmer} />
              ))}
            </div>

            <div className="mt-10 text-center">
              <Link to="/marketplace">
                <Button>Browse Marketplace</Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Farmers;
