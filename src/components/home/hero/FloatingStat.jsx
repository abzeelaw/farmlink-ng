
import { PackageCheck } from "lucide-react";

const FloatingStat = () => {
  return (
    <div className="absolute bottom-4 right-0 rounded-xl bg-white p-3 shadow-xl sm:bottom-8 sm:p-4 md:bottom-12">
      <div className="flex items-center gap-2 sm:gap-3">
        <PackageCheck
          className="h-6 w-6 text-emerald-600 sm:h-[30px] sm:w-[30px]"
        />

        <div>
          <h3 className="text-sm font-bold sm:text-base">
            8,000+
          </h3>

          <p className="text-[10px] text-slate-500 sm:text-xs md:text-sm">
            Successful Orders
          </p>
        </div>
      </div>
    </div>
  );
};

export default FloatingStat;
