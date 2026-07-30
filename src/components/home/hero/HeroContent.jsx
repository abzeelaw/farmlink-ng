import { ArrowRight, Store } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "../../ui";
import HeroStats from "./HeroStats";

const HeroContent = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
    >
    <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-7 py-3 font-semibold text-emerald-700">
  <span className="text-lg">🌿</span>
  <span>Trusted Produce Marketplace</span>
</span>

      <h1 className="heading-xl mt-6 ">
        Fresh Farm Produce Delivered Straight From Trusted Nigerian Farmers.
      </h1>

      <p className="text-muted mt-6 max-w-xl">
        Buy fruits, vegetables, grains, and other fresh produce directly from verified farmers across Nigeria. Fast, secure, and reliable.
      </p>

      <div className="mt-8 flex flex-wrap gap-4">
        <Button rightIcon={<ArrowRight size={18} />}>
          Explore Marketplace
        </Button>

        <Button variant="outline" leftIcon={<Store size={18} />}>
          Become a Seller
        </Button>
      </div>

      <HeroStats />
    </motion.div>
  );
};

export default HeroContent;