
import { useEffect, useState } from "react";
import { heroStats } from "../../../constants/stats";

const parseNumber = (s) => {
  if (!s) return 0;
  const num = parseFloat(s.replace(/[^0-9.]/g, "")) || 0;
  if (s.toUpperCase().includes("K")) return Math.round(num * 1000);
  if (s.toUpperCase().includes("M")) return Math.round(num * 1000000);
  return Math.round(num);
};

const formatWithSuffix = (n, original) => {
  if (original.toUpperCase().includes("K")) return `${Math.round(n / 1000)}K+`;
  if (original.toUpperCase().includes("M")) return `${(n / 1000000).toFixed(1)}M+`;
  return `${n}`;
};

const AnimatedStat = ({ targetStr }) => {
  const target = parseNumber(targetStr);
  const [value, setValue] = useState(0);

  useEffect(() => {
    let raf = null;
    const duration = 1400;
    const start = performance.now();

    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(eased * target));
      if (t < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => raf && cancelAnimationFrame(raf);
  }, [target]);

  return <>{formatWithSuffix(value, targetStr)}</>;
};

const HeroStats = () => {
  return (
    <div className="mt-8 grid grid-cols-3 gap-3 sm:mt-10 sm:gap-6">
      {heroStats.map((stat) => (
        <div key={stat.label} className="min-w-0">
          <h3 className="text-2xl font-bold text-emerald-600 sm:text-3xl">
            <AnimatedStat targetStr={stat.number} />
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
