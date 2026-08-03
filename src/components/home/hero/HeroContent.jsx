
import { ArrowRight, Store } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "../../ui";
import HeroStats from "./HeroStats";

const HeroContent = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full"
    >
      {/* Badge */}
      <span className="inline-flex max-w-full items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700 sm:px-5 sm:py-2.5 sm:text-base md:px-6">
        <span className="text-base sm:text-lg">🌿</span>
        <span>Trusted Produce Marketplace</span>
      </span>

      {/* Heading */}
      <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl md:mt-6 md:text-5xl lg:text-6xl xl:text-7xl">
        Fresh Farm Produce Delivered Straight From Trusted Nigerian Farmers.
      </h1>

      {/* Description */}
      <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8 md:mt-6">
        Buy fruits, vegetables, grains, and other fresh produce directly from
        verified farmers across Nigeria. Fast, secure, and reliable.
      </p>

      {/* Buttons */}
      <div className="mt-7 flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4 md:mt-8">
        <Button
          rightIcon={<ArrowRight size={18} />}
          className="w-full sm:w-auto"
        >
          Explore Marketplace
        </Button>

        <Button
          variant="outline"
          leftIcon={<Store size={18} />}
          className="w-full sm:w-auto"
        >
          Become a Seller
        </Button>
      </div>

      {/* Statistics */}
      <HeroStats />
    </motion.div>
  );
};

export default HeroContent;
