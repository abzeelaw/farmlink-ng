import { heroStats } from "../../../constants/stats";

const HeroStats = () => {
  return (
    <div className="mt-10 grid grid-cols-3 gap-6">
      {heroStats.map((stat) => (
        <div key={stat.label}>
          <h3 className="text-3xl font-bold text-emerald-600">
            {stat.number}
          </h3>

          <p className="text-sm text-slate-600">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
};

export default HeroStats;