import products from "../../data/products";
import ProductCard from "../cards/ProductCard";
import SectionHeader from "../common/SectionHeader";
import Button from "../ui/Button";

const FeaturedProducts = () => {
  return (
    <section className="section-padding bg-slate-50">
      <div className="container-width">
        <div className="mb-12 flex flex-col items-center justify-between gap-6 md:flex-row">
          <SectionHeader
            badge="Featured"
            title="Fresh Picks from Verified Farmers"
            subtitle="Discover high-quality produce sourced directly from trusted farmers across Nigeria."
          />

          <Button variant="outline">
            View All Products
          </Button>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;