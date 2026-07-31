
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { supabase } from "../../lib/supabase";

import SectionHeader from "../common/SectionHeader";
import FarmerCard from "../cards/FarmerCard";
import { Button } from "../ui";

const FeaturedFarmers = () => {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedFarmers = async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select(`
            id,
            full_name,
            avatar_url,
            role,
            farm_name,
            farm_description,
            state,
            city,
            farm_image,
            verification_status,
            rating,
            total_sales,
            created_at
          `)
          .eq("role", "farmer")
          .eq("verification_status", "verified")
          .order("total_sales", {
            ascending: false,
          })
          .limit(3);

        if (error) {
          console.error(
            "Failed to fetch featured farmers:",
            error
          );
          return;
        }

        setFarmers(data || []);
      } catch (error) {
        console.error(
          "Featured farmers error:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedFarmers();
  }, []);

  return (
    <section className="section-padding bg-white">
      <div className="container-width">

        <SectionHeader
          badge="Verified Farmers"
          title="Meet Our Trusted Farmers"
          subtitle="Connect directly with verified farmers across Nigeria."
        />

        {loading ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-72 animate-pulse rounded-3xl bg-slate-100"
              />
            ))}
          </div>
        ) : farmers.length === 0 ? (
          <div className="rounded-3xl bg-slate-50 p-10 text-center">
            <p className="text-slate-500">
              No verified farmers are currently available.
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {farmers.map((farmer) => (
                <FarmerCard
                  key={farmer.id}
                  farmer={farmer}
                />
              ))}
            </div>

            <div className="mt-10 flex justify-center">
              <Link to="/farmers">
                <Button variant="outline">
                  View All Farmers
                </Button>
              </Link>
            </div>
          </>
        )}

      </div>
    </section>
  );
};

export default FeaturedFarmers;