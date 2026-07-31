
import { Link } from "react-router-dom";
import {
  ShoppingCart,
  Star,
  MapPin,
} from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "../ui";
import { useCart } from "../../context/CartContext";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart(product, 1);

    toast.success(
      `${product.name} added to cart`
    );
  };

  const categoryName =
    product?.categories?.name ||
    product?.category ||
    "Produce";

  const farmerName =
    product?.profiles?.full_name ||
    product?.farmer ||
    "Verified Farmer";

  const location =
    product?.city && product?.state
      ? `${product.city}, ${product.state}`
      : product?.state ||
        product?.city ||
        "Nigeria";

  const price = Number(product?.price || 0);

  return (
    <Link
      to={`/product/${product.id}`}
      className="block"
    >
      <div className="group overflow-hidden rounded-3xl bg-white shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">

        {/* Product Image */}

        <div className="h-56 overflow-hidden bg-slate-100">
          {product?.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-slate-400">
              No image available
            </div>
          )}
        </div>

        {/* Card Content */}

        <div className="p-5">

          {/* Category */}

          <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
            {categoryName}
          </span>

          {/* Product Name */}

          <h3 className="mt-4 line-clamp-1 text-xl font-bold text-slate-900">
            {product.name}
          </h3>

          {/* Farmer */}

          <p className="mt-1 text-sm text-slate-500">
            Sold by{" "}
            <span className="font-medium text-slate-700">
              {farmerName}
            </span>
          </p>

          {/* Location */}

          <div className="mt-3 flex items-center gap-2 text-slate-600">
            <MapPin size={16} />

            <span className="line-clamp-1">
              {location}
            </span>
          </div>

          {/* Rating & Price */}

          <div className="mt-4 flex items-center justify-between">

            <div className="flex items-center gap-1">

              <Star
                size={16}
                className="fill-yellow-400 text-yellow-400"
              />

              <span className="font-medium">
                {product?.rating || "New"}
              </span>

            </div>

            <h4 className="text-2xl font-bold text-emerald-600">
              ₦{price.toLocaleString()}
            </h4>

          </div>

          {/* Buttons */}

          <div className="mt-6 flex gap-3">

            <Button
              variant="outline"
              className="flex-1"
            >
              View Details
            </Button>

            <Button
              className="flex-1"
              leftIcon={
                <ShoppingCart size={18} />
              }
              onClick={handleAddToCart}
            >
              Add
            </Button>

          </div>

        </div>

      </div>
    </Link>
  );
};

export default ProductCard;