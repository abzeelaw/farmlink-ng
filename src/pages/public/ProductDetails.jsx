import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import ProductGallery from "../../components/product/ProductGallery";
import ProductInfo from "../../components/product/ProductInfo";
import DeliveryInfo from "../../components/product/DeliveryInfo";

import {
  getProductById,
  getRelatedProducts,
} from "../../services/productService";

const ProductDetails = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      const { data, error } = await getProductById(id);

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      const formattedProduct = {
        ...data,
        category: data.categories?.name || "Uncategorized",
        farmer: data.profiles?.full_name || "Unknown Farmer",
        rating: 5.0,
      };

      setProduct(formattedProduct);

      const related = await getRelatedProducts(
        data.category_id,
        data.id
      );

      if (!related.error) {
        setRelatedProducts(related.data);
      }

      setLoading(false);
    };

    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="container-width section-padding">
        <h2 className="text-3xl font-bold">
          Loading Product...
        </h2>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-width section-padding">
        <h2 className="text-3xl font-bold">
          Product not found
        </h2>
      </div>
    );
  }

  return (
    <section className="section-padding">
      <div className="container-width">
        <div className="grid gap-14 lg:grid-cols-2">
          <ProductGallery product={product} />

          <div>
            <ProductInfo
              product={product}
              quantity={quantity}
              setQuantity={setQuantity}
            />

            <DeliveryInfo />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetails;