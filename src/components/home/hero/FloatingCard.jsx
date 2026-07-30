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
      animate={{ y: [0, -10, 0] }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={`absolute w-52 rounded-2xl bg-white p-4 shadow-xl ${className}`}
    >
      <img
        src={image}
        alt={title}
        className="h-28 w-full rounded-xl object-cover"
      />

      <h3 className="mt-3 font-semibold">
        {title}
      </h3>

      <div className="mt-2 flex items-center justify-between">
        <span className="font-bold text-emerald-600">
          {price}
        </span>

        <span className="flex items-center gap-1 text-sm">
          <Star
            size={14}
            className="fill-yellow-400 text-yellow-400"
          />
          4.9
        </span>
      </div>
    </motion.div>
  );
};

export default FloatingCard;