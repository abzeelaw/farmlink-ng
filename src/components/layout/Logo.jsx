import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link
      to="/"
      className="flex items-center gap-2"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-xl font-bold text-white">
        F
      </div>

      <div>
        <h2 className="text-xl font-bold text-slate-900">
          FarmLink NG
        </h2>

        <p className="text-xs text-slate-500">
          Fresh Produce Marketplace
        </p>
      </div>
    </Link>
  );
};

export default Logo;