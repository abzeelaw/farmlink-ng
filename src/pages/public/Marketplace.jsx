import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import MarketplaceHero from "../../components/marketplace/MarketplaceHero";
import SearchBar from "../../components/marketplace/SearchBar";
import CategoryFilter from "../../components/marketplace/CategoryFilter";
import FilterBar from "../../components/marketplace/FilterBar";
import ProductGrid from "../../components/marketplace/ProductGrid";

const Marketplace = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedState, setSelectedState] = useState("All States");
  const [sortBy, setSortBy] = useState("Newest");

  const location = useLocation();

  useEffect(() => {
    const run = () => {
      const params = new URLSearchParams(location.search);
      const q = params.get("q") || "";

      if (q) setSearchTerm(q);
    };

    run();
  }, [location.search]);

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

      <FilterBar
        selectedState={selectedState}
        setSelectedState={setSelectedState}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      <ProductGrid
        activeCategory={activeCategory}
        searchTerm={searchTerm}
        selectedState={selectedState}
        sortBy={sortBy}
      />
    </>
  );
};

export default Marketplace;