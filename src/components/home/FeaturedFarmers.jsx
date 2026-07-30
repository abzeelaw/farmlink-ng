import SectionHeader from "../common/SectionHeader";
import FarmerCard from "../cards/FarmerCard";
import { farmers } from "../../data/farmers";

const FeaturedFarmers = () => {
  return (
    <section className="section-padding bg-white">
      <div className="container-width">
        <SectionHeader
          badge="Verified Farmers"
          title="Meet Our Trusted Farmers"
          subtitle="Connect directly with verified farmers across Nigeria."
        />

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {farmers.map((farmer) => (
            <FarmerCard
              key={farmer.id}
              farmer={farmer}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedFarmers;