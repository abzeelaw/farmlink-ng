import { motion } from "framer-motion";

import FloatingCard from "./FloatingCard";
import FloatingStat from "./FloatingStat";
import TrustBadge from "./TrustBadge";
import mainimage from"../../../assets/images/hero/mainfarmer2.png";
import pepperimage from "../../../assets/images/hero/pepper.png";
import tomatoeimage from "../../../assets/images/hero/Basketoftomatoes.png";

const HeroImage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      className="relative flex h-[600px] items-center justify-center"
    >
      <div className="flex h-126 w-126 items-center justify-center rounded-full  shadow-2xl">
        <img src={mainimage} alt="main image" className=" scale-x-[-1]"/>
      </div>

      <TrustBadge />

      <FloatingCard
        title="Fresh Tomatoes"
        price="₦5,000"
        image={tomatoeimage}
        className="top-10 right-0 w-fit"
      />

      <FloatingCard
        title="Organic Pepper"
        price="₦2,500"
        image={pepperimage}
        className="bottom-24 left-6 w-fit"
      />

      <FloatingStat />
    </motion.div>
  );
};

export default HeroImage;