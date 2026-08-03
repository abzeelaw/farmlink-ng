
import { Star } from "lucide-react";
import { motion } from "framer-motion";

const FloatingCard = ({
  title,
  price,
  image,
  className = "",
}) => {
  return (
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={`absolute z-10 w-28 rounded-xl bg-white p-2 shadow-lg sm:w-32 sm:p-2.5 md:w-36 md:rounded-2xl md:p-3 ${className}`}
    >
      <img
        src={image}
        alt={title}
        className="h-16 w-full rounded-lg object-cover sm:h-18 md:h-20"
      />

      <h3 className="mt-1.5 truncate text-xs font-semibold sm:mt-2 sm:text-sm">
        {title}
      </h3>

      <div className="mt-1 flex items-center justify-between gap-1">
        <span className="text-xs font-bold text-emerald-600">
          {price}
        </span>

        <span className="flex items-center gap-0.5 text-[10px] sm:text-xs">
          <Star
            size={10}
            className="fill-yellow-400 text-yellow-400"
          />
          4.9
        </span>
      </div>
    </motion.div>
  );
};

export default FloatingCard;
