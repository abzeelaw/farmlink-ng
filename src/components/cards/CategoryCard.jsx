import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const CategoryCard = ({ category }) => {
  const Icon = category.icon;

  return (
    <motion.div
      whileHover={{
        y: -8,
      }}
      transition={{ duration: 0.25 }}
      className="group cursor-pointer rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-xl"
    >
      <div
        className={`flex h-16 w-16 items-center justify-center rounded-2xl ${category.color}`}
      >
        <Icon
          size={30}
          className={category.iconColor}
        />
      </div>

      <h3 className="mt-6 text-xl font-bold">
        {category.name}
      </h3>

      <p className="mt-2 text-slate-500">
        {category.products}+ Products
      </p>

      <div className="mt-6 flex items-center gap-2 font-semibold text-emerald-600">
        Explore

        <ArrowRight
          size={18}
          className="transition-transform group-hover:translate-x-1"
        />
      </div>
    </motion.div>
  );
};

export default CategoryCard;