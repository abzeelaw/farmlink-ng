
import { motion } from "framer-motion";

const circles = [
  "top-10 -left-20 h-48 w-48 sm:h-64 sm:w-64 md:h-72 md:w-72",
  "bottom-10 -right-20 h-64 w-64 sm:h-80 sm:w-80 md:h-96 md:w-96",
  "top-1/2 left-1/2 h-28 w-28 sm:h-36 sm:w-36 md:h-40 md:w-40",
];

const BackgroundShapes = () => {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {circles.map((circle, index) => (
        <motion.div
          key={index}
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
          }}
          transition={{
            duration: 8 + index * 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className={`absolute ${circle} rounded-full bg-emerald-200/20 blur-3xl`}
        />
      ))}
    </div>
  );
};

export default BackgroundShapes;
