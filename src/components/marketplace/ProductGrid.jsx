import { useEffect, useState } from "react";
import ProductCard from "../cards/ProductCard";
import { getProducts } from "../../services/productService";

const ProductGrid = ({
  activeCategory,
  searchTerm,
}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      const { data, error } = await getProducts();

      if (!error && data) {
        let formattedProducts = data.map((item) => ({
          ...item,
          category: item.categories?.name || "Uncategorized",
          farmer: item.profiles?.full_name || "Unknown Farmer",
          rating: 5.0,
        }));

        // Category filter
        if (activeCategory !== "All") {
          formattedProducts = formattedProducts.filter(
            (product) => product.category === activeCategory
          );
        }

        // Search filter
        if (searchTerm.trim() !== "") {
          formattedProducts = formattedProducts.filter((product) =>
            product.name
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
          );
        }

        setProducts(formattedProducts);
      }

      setLoading(false);
    };

    loadProducts();
  }, [activeCategory, searchTerm]);

  if (loading) {
    return (
      <section className="container-width py-20 text-center">
        Loading products...
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="container-width py-20 text-center">
        <h2 className="text-3xl font-bold">
          No products found
        </h2>

        <p className="mt-4 text-slate-500">
          Try another search or category.
        </p>
      </section>
    );
  }

  return (
    <section className="container-width py-12">
      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>
    </section>
  );
};

export default ProductGrid;