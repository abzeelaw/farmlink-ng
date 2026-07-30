import { ShieldCheck } from "lucide-react";

const TrustBadge = () => {
  return (
    <div className="absolute left-1 top-16 rounded-xl p-5 bg-white shadow-lg w-auto">
      <div className="flex items-center gap-4">
        <ShieldCheck
          className="text-emerald-600"
          size={24}
        />

        <div>
          <h4 className="font-semibold">
            Verified Farmers
          </h4>

          <p className="text-xs text-slate-500">
            Trusted sellers nationwide
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrustBadge;