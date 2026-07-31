
import { ArrowRight, Leaf } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const CategoryCard = ({ category }) => {
  const categoryName = category?.name || "Category";

  const categoryDescription =
    category?.description ||
    "Explore fresh products from trusted farmers.";

  const categoryImage =
    category?.image ||
    category?.image_url ||
    null;

  return (
    <Link
      to={`/marketplace?category=${category.id}`}
      className="block"
    >
      <motion.div
        whileHover={{ y: -8 }}
        transition={{ duration: 0.25 }}
        className="group cursor-pointer overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-xl"
      >

        {/* Category Image / Fallback */}

        <div className="relative flex h-40 items-center justify-center overflow-hidden bg-emerald-50">

          {categoryImage ? (
            <img
              src={categoryImage}
              alt={categoryName}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100">
              <Leaf
                size={32}
                className="text-emerald-600"
              />
            </div>
          )}

          {/* Overlay */}

          {categoryImage && (
            <div className="absolute inset-0 bg-black/10 transition group-hover:bg-black/20" />
          )}

        </div>

        {/* Content */}

        <div className="p-6">

          <h3 className="text-xl font-bold text-slate-900">
            {categoryName}
          </h3>

          <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
            {categoryDescription}
          </p>

          <div className="mt-6 flex items-center gap-2 font-semibold text-emerald-600">

            <span>
              Explore
            </span>

            <ArrowRight
              size={18}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />

          </div>

        </div>

      </motion.div>
    </Link>
  );
};

export default CategoryCard;
