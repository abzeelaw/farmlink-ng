import SectionHeader from "../common/SectionHeader";
import StepCard from "../cards/StepCard";
import { howItWorks } from "../../data/howItWorks";

const HowItWorks = () => {
  return (
    <section className="section-padding bg-slate-50">
      <div className="container-width">
        <SectionHeader
          badge="How It Works"
          title="Buy Fresh Produce in Four Simple Steps"
          subtitle="FarmLink NG makes shopping directly from farmers easy, secure, and convenient."
        />

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {howItWorks.map((step) => (
            <StepCard
              key={step.id}
              step={step}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;