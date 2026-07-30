import { motion } from "framer-motion";

const FeatureCard = ({ feature }) => {
  const Icon = feature.icon;

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.25 }}
      className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-xl"
    >
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100">
        <Icon
          size={32}
          className="text-emerald-600"
        />
      </div>

      <h3 className="mb-4 text-2xl font-bold text-slate-900">
        {feature.title}
      </h3>

      <p className="leading-7 text-slate-600">
        {feature.description}
      </p>
    </motion.div>
  );
};

export default FeatureCard;