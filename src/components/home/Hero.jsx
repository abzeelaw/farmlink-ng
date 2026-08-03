import BackgroundShapes from "./hero/BackgroundShapes";
import HeroContent from "./hero/HeroContent";
import HeroImage from "./hero/HeroImage";

const Hero = () => {
  return (
    <section className="relative overflow-hidden">
  <BackgroundShapes />

  <div className="container-width relative">
    <div className="grid items-center gap-10 py-16 md:gap-12 md:py-20 lg:grid-cols-2 lg:gap-16 lg:py-28">
      <HeroContent />
      <HeroImage />
    </div>
  </div>
</section>
  );
};

export default Hero;