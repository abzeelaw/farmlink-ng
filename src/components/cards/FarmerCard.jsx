import { MapPin, Star, BadgeCheck } from "lucide-react";
import { Button } from "../ui";

const FarmerCard = ({ farmer }) => {
  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-lg transition hover:-translate-y-2 hover:shadow-xl">
      <img
        src={farmer.image}
        alt={farmer.name}
        className="h-64 w-full object-cover"
      />

      <div className="p-6">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-xl font-bold">
            {farmer.name}
          </h3>

          <BadgeCheck
            size={20}
            className="text-emerald-600"
          />
        </div>

        <div className="mb-3 flex items-center gap-2 text-slate-600">
          <MapPin size={18} />
          {farmer.state}
        </div>

        <div className="mb-4 flex items-center gap-2">
          <Star
            size={18}
            fill="orange"
            color="orange"
          />
          {farmer.rating}
        </div>

        <p className="mb-6 text-slate-600">
          {farmer.specialty}
        </p>

        <Button className="w-full">
          View Store
        </Button>
      </div>
    </div>
  );
};

export default FarmerCard;