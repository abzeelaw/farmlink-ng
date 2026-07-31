
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";

import ProductCard from "../cards/ProductCard";
import SectionHeader from "../common/SectionHeader";
import Button from "../ui/Button";

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const { data, error } = await supabase
          .from("products")
          .select(`
            id,
            name,
            description,
            price,
            stock,
            image,
            state,
            city,
            farmer_id,
            category_id,
            created_at,
            categories (
              id,
              name
            ),
            profiles (
              id,
              full_name,
              avatar_url,
              role
            )
          `)
          .gt("stock", 0)
          .order("created_at", {
            ascending: false,
          })
          .limit(4);

        if (error) {
          console.error(
            "Failed to fetch featured products:",
            error
          );
          return;
        }

        setProducts(data || []);
      } catch (error) {
        console.error(
          "Featured products error:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <section className="section-padding bg-slate-50">
      <div className="container-width">

        <div className="mb-12 flex flex-col items-center justify-between gap-6 md:flex-row">

          <SectionHeader
            badge="Featured"
            title="Fresh Picks from Verified Farmers"
            subtitle="Discover high-quality produce sourced directly from trusted farmers across Nigeria."
          />

          <Link to="/marketplace">
            <Button variant="outline">
              View All Products
            </Button>
          </Link>

        </div>

        {loading ? (
          <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-80 animate-pulse rounded-2xl bg-white"
              />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center">
            <p className="text-slate-500">
              No products are currently available.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

export default FeaturedProducts;