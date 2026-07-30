import { PackageCheck } from "lucide-react";

const FloatingStat = () => {
  return (
    <div className="absolute bottom-12 right-0 rounded-2xl bg-white p-4 shadow-xl">
      <div className="flex items-center gap-3">
        <PackageCheck
          className="text-emerald-600"
          size={30}
        />

        <div>
          <h3 className="font-bold">
            8,000+
          </h3>

          <p className="text-sm text-slate-500">
            Successful Orders
          </p>
        </div>
      </div>
    </div>
  );
};

export default FloatingStat;