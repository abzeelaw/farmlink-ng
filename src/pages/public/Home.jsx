import Hero from "../../components/home/Hero";
import Categories from "../../components/home/Categories";
import FeaturedProducts from "../../components/home/FeaturedProducts";
import WhyChooseUs from "../../components/home/WhyChooseUs";
import FeaturedFarmers from "../../components/home/FeaturedFarmers";
import HowItWorks from "../../components/home/HowItWorks";

const Home = () => {
  return (
    <>
      <Hero />
      <Categories />
      <FeaturedProducts />
      <WhyChooseUs />
      <HowItWorks />
      <FeaturedFarmers />
    </>
  );
};

export default Home;