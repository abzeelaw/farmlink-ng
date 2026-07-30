import BackgroundShapes from "./hero/BackgroundShapes";
import HeroContent from "./hero/HeroContent";
import HeroImage from "./hero/HeroImage";

const Hero = () => {
  return (
    <section className="relative overflow-hidden section-padding">
      <BackgroundShapes />

      <div className="container-width grid items-center gap-16 lg:grid-cols-2">
        <HeroContent />
        <HeroImage />
      </div>
    </section>
  );
};

export default Hero;