import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

const CategoryFilter = ({
  activeCategory,
  setActiveCategory,
}) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("name")
        .order("name", { ascending: true });

      if (error) {
        console.error("Error fetching categories:", error);
        return;
      }

      const categoryNames = data.map(
        (category) => category.name
      );

      setCategories(["All", ...categoryNames]);
    };

    fetchCategories();
  }, []);

  return (
    <div className="container-width mt-10">
      <div className="flex flex-wrap gap-3">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`rounded-full px-5 py-2 font-medium transition ${
              activeCategory === category
                ? "bg-emerald-600 text-white"
                : "border border-slate-200 bg-white text-slate-700 hover:border-emerald-600 hover:text-emerald-600"
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;