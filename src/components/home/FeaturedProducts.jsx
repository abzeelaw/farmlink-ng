
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
              role,
              farm_name,
              verification_status
            )
          `)
          .gt("stock", 0)
          .order("created_at", {
            ascending: false,
          })
          .limit(12);

        if (error) {
          console.error(
            "Failed to fetch featured products:",
            error
          );

          return;
        }

        // Only show products belonging to verified farmers
        const verifiedProducts = (data || []).filter(
          (product) =>
            product.profiles?.role === "farmer" &&
            product.profiles?.verification_status ===
              "verified"
        );

        // Format Supabase data for ProductCard
        const formattedProducts = verifiedProducts
          .slice(0, 4)
          .map((product) => ({
            id: product.id,

            name: product.name,

            description:
              product.description || "",

            price:
              Number(product.price) || 0,

            stock:
              Number(product.stock) || 0,

            image:
              product.image ||
              "/placeholder-product.jpg",

            category:
              product.categories?.name ||
              "Other",

            farmer:
              product.profiles?.farm_name ||
              product.profiles?.full_name ||
              "Verified Farmer",

            farmer_id:
              product.farmer_id,

            state:
              product.state ||
              "Nigeria",

            city:
              product.city || "",

            rating:
              product.rating || 0,

            created_at:
              product.created_at,
          }));

        setProducts(formattedProducts);
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

        {/* Section Header */}
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

        {/* Loading State */}
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-64 animate-pulse rounded-2xl bg-white"
              />
            ))}
          </div>
        ) : products.length === 0 ? (

          /* Empty State */
          <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
            <h3 className="text-xl font-semibold text-slate-800">
              No featured products available yet
            </h3>

            <p className="mt-2 text-slate-500">
              Verified farmers have not added available
              products yet.
            </p>

            <Link to="/marketplace">
              <Button className="mt-6">
                Browse Marketplace
              </Button>
            </Link>
          </div>

        ) : (

          /* Featured Products */
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
