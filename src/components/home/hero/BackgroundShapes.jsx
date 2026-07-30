import { motion } from "framer-motion";

const circles = [
  "top-10 left-0 w-72 h-72",
  "bottom-10 right-0 w-96 h-96",
  "top-1/2 left-1/2 w-40 h-40",
];

const BackgroundShapes = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
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