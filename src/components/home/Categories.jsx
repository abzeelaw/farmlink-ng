
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

import SectionHeader from "../../../src/components/common/SectionHeader";
import CategoryCard from "../../../src/components/cards/CategoryCard";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from("categories")
          .select("*")
          .order("name", {
            ascending: true,
          });

        if (error) {
          console.error("Failed to fetch categories:", error);
          return;
        }

        setCategories(data || []);
      } catch (error) {
        console.error("Categories error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <section className="section-padding bg-white">
      <div className="container-width">

        <SectionHeader
          badge="Categories"
          title="Browse Fresh Produce by Category"
          subtitle="Explore a wide range of agricultural products sourced directly from trusted farmers across Nigeria."
        />

        {loading ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-40 animate-pulse rounded-2xl bg-slate-100"
              />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="rounded-2xl bg-slate-50 p-10 text-center">
            <p className="text-slate-500">
              No categories available at the moment.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

export default Categories;