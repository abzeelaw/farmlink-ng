import SectionHeader from "../common/SectionHeader";
import CategoryCard from "../cards/CategoryCard";
import { homeCategories } from "../../data/homeCategories";

const Categories = () => {
  return (
    <section className="section-padding bg-white">
      <div className="container-width">
        <SectionHeader
          badge="Categories"
          title="Browse Fresh Produce by Category"
          subtitle="Explore a wide range of agricultural products sourced directly from trusted farmers across Nigeria."
        />

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {homeCategories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;