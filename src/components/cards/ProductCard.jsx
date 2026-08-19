
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
      <div className="group overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">

        {/* Product Image */}

        <div className="h-40 overflow-hidden bg-slate-100">
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

        <div className="p-4">

          {/* Category */}

          <span className="inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
            {categoryName}
          </span>

          {/* Product Name */}

          <h3 className="mt-3 line-clamp-1 text-lg font-bold text-slate-900">
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

          <div className="mt-3 flex items-center justify-between">

            <div className="flex items-center gap-1">

              <Star
                size={16}
                className="fill-yellow-400 text-yellow-400"
              />

              <span className="font-medium">
                {product?.rating || "New"}
              </span>

            </div>

            <h4 className="text-xl font-bold text-emerald-600">
              ₦{price.toLocaleString()}
            </h4>

          </div>

          {/* Buttons */}

          <div className="mt-4 flex gap-3">

            <Button variant="outline" className="px-3 py-2 text-sm">
              View
            </Button>

            <Button className="px-3 py-2 text-sm" leftIcon={<ShoppingCart size={16} />} onClick={handleAddToCart}>
              Add
            </Button>

          </div>

        </div>

      </div>
    </Link>
  );
};

export default ProductCard;