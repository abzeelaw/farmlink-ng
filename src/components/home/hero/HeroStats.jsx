
import { heroStats } from "../../../constants/stats";

const HeroStats = () => {
  return (
    <div className="mt-8 grid grid-cols-3 gap-3 sm:mt-10 sm:gap-6">
      {heroStats.map((stat) => (
        <div key={stat.label} className="min-w-0">
          <h3 className="text-2xl font-bold text-emerald-600 sm:text-3xl">
            {stat.number}
          </h3>

          <p className="mt-1 text-xs leading-5 text-slate-600 sm:text-sm">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
};

export default HeroStats;
