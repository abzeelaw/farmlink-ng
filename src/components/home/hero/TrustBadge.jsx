
import { ShieldCheck } from "lucide-react";

const TrustBadge = () => {
  return (
    <div className="absolute left-0 top-6 rounded-xl bg-white p-3 shadow-lg sm:left-1 sm:top-12 sm:p-4 md:top-16 md:p-5">
      <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
        <ShieldCheck
          className="h-5 w-5 text-emerald-600 sm:h-6 sm:w-6"
        />

        <div>
          <h4 className="text-xs font-semibold sm:text-sm md:text-base">
            Verified Farmers
          </h4>

          <p className="text-[9px] text-slate-500 sm:text-[10px] md:text-xs">
            Trusted sellers nationwide
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrustBadge;
