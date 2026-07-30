import { motion } from "framer-motion";

const StepCard = ({ step }) => {
  const Icon = step.icon;

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
      className="relative rounded-3xl bg-white p-8 text-center shadow-sm border border-slate-200"
    >
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
        <Icon
          size={30}
          className="text-emerald-600"
        />
      </div>

      <div className="mt-5 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-white font-bold mx-auto">
        {step.id}
      </div>

      <h3 className="mt-5 text-xl font-bold">
        {step.title}
      </h3>

      <p className="mt-3 text-slate-600">
        {step.description}
      </p>
    </motion.div>
  );
};

export default StepCard;