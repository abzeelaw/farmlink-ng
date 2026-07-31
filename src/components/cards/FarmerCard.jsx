import { Link } from "react-router-dom";
import {
  MapPin,
  Star,
  BadgeCheck,
  UserRound,
  ShoppingBag,
} from "lucide-react";

import { Button } from "../ui";

const FarmerCard = ({ farmer }) => {
  const farmerName =
    farmer?.full_name || "Farmer";

  const farmName =
    farmer?.farm_name || "FarmLink Farmer";

  const location = [
    farmer?.city,
    farmer?.state,
  ]
    .filter(Boolean)
    .join(", ");

  const rating = Number(farmer?.rating || 0);

  const totalSales = Number(
    farmer?.total_sales || 0
  );

  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-lg transition hover:-translate-y-2 hover:shadow-xl">

      {/* Farm Image */}

      <div className="h-64 overflow-hidden bg-slate-100">

        {farmer?.farm_image ? (
          <img
            src={farmer.farm_image}
            alt={farmName}
            className="h-full w-full object-cover transition duration-500 hover:scale-105"
          />
        ) : farmer?.avatar_url ? (
          <img
            src={farmer.avatar_url}
            alt={farmerName}
            className="h-full w-full object-cover transition duration-500 hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100">
              <UserRound
                size={48}
                className="text-emerald-600"
              />
            </div>
          </div>
        )}

      </div>

      {/* Content */}

      <div className="p-6">

        {/* Farmer Name */}

        <div className="flex items-center justify-between gap-3">

          <div>
            <h3 className="text-xl font-bold text-slate-900">
              {farmerName}
            </h3>

            <p className="mt-1 text-sm font-medium text-emerald-600">
              {farmName}
            </p>
          </div>

          <BadgeCheck
            size={22}
            className="shrink-0 text-emerald-600"
          />

        </div>

        {/* Location */}

        {location && (
          <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
            <MapPin size={17} />
            <span>{location}</span>
          </div>
        )}

        {/* Rating + Sales */}

        <div className="mt-4 flex items-center gap-5">

          <div className="flex items-center gap-1">
            <Star
              size={17}
              className="fill-yellow-400 text-yellow-400"
            />

            <span className="font-medium">
              {rating > 0
                ? rating.toFixed(1)
                : "New"}
            </span>
          </div>

          <div className="flex items-center gap-1 text-slate-500">
            <ShoppingBag size={16} />

            <span>
              {totalSales} sales
            </span>
          </div>

        </div>

        {/* Description */}

        <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-600">
          {farmer?.farm_description ||
            "A trusted FarmLink farmer providing quality agricultural products directly to customers."}
        </p>

        {/* Button */}

        <Link
          to={`/farmer/${farmer.id}`}
          className="mt-6 block"
        >
          <Button className="w-full">
            View Farm
          </Button>
        </Link>

      </div>
    </div>
  );
};

export default FarmerCard;