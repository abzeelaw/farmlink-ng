import { features } from "../../data/features";
import FeatureCard from "../cards/FeatureCard";
import SectionHeader from "../common/SectionHeader";

const WhyChooseUs = () => {
  return (
    <section className="section-padding bg-white">
      <div className="container-width">
        <SectionHeader
          badge="Why FarmLink NG"
          title="Built Around Trust, Quality, and Convenience"
          subtitle="We're making it easier for Nigerians to buy fresh produce directly from verified farmers."
        />

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature) => (
            <FeatureCard
              key={feature.id}
              feature={feature}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;