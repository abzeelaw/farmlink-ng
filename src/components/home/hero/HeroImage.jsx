
import { motion } from "framer-motion";

import FloatingCard from "./FloatingCard";
import FloatingStat from "./FloatingStat";
import TrustBadge from "./TrustBadge";

import mainimage from "../../../assets/images/hero/mainfarmer2.png";
import pepperimage from "../../../assets/images/hero/pepper.png";
import tomatoeimage from "../../../assets/images/hero/Basketoftomatoes.png";

const HeroImage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      className="relative mx-auto flex h-[430px] w-full max-w-[540px] items-center justify-center sm:h-[510px] md:h-[580px] lg:h-[640px]"
    >
      {/* Main Farmer Image */}
      <div className="flex h-[340px] w-[340px] items-center justify-center rounded-full shadow-2xl sm:h-[410px] sm:w-[410px] md:h-[500px] md:w-[500px] lg:h-[580px] lg:w-[580px]">
        <img
          src={mainimage}
          alt="Farmer holding fresh produce"
          className="h-full w-full object-contain scale-x-[-1]"
        />
      </div>

      {/* Verified Farmers */}
      <TrustBadge />

      {/* Fresh Tomatoes */}
      <FloatingCard
        title="Fresh Tomatoes"
        price="₦5,000"
        image={tomatoeimage}
        className="right-0 top-10 sm:right-1 md:right-0"
      />

      {/* Organic Pepper */}
      <FloatingCard
        title="Organic Pepper"
        price="₦2,500"
        image={pepperimage}
        className="bottom-16 left-0 sm:left-1 md:left-4"
      />

      {/* Successful Orders */}
      <FloatingStat />
    </motion.div>
  );
};

export default HeroImage;
