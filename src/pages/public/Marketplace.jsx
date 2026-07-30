import { useState } from "react";

import MarketplaceHero from "../../components/marketplace/MarketplaceHero";
import SearchBar from "../../components/marketplace/SearchBar";
import CategoryFilter from "../../components/marketplace/CategoryFilter";
import FilterBar from "../../components/marketplace/FilterBar";
import ProductGrid from "../../components/marketplace/ProductGrid";

const Marketplace = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <>
      <MarketplaceHero />

      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <CategoryFilter
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />

      <FilterBar />

      <ProductGrid
        activeCategory={activeCategory}
        searchTerm={searchTerm}
      />
    </>
  );
};

export default Marketplace;