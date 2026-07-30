import { Link } from "react-router-dom";
import { ShoppingCart, Star, MapPin } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "../ui";
import { useCart } from "../../context/CartContext";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    // Prevent navigating when clicking the button
    e.preventDefault();
    e.stopPropagation();

    addToCart(product, 1);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <Link to={`/product/${product.id}`}>
      <div className="group overflow-hidden rounded-3xl bg-white shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
        {/* Product Image */}
        <div className="overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </div>

        {/* Card Content */}
        <div className="p-5">
          {/* Category */}
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
            {product.category}
          </span>

          {/* Product Name */}
          <h3 className="mt-4 text-xl font-bold text-slate-900">
            {product.name}
          </h3>

          {/* Farmer */}
          <p className="mt-1 text-sm text-slate-500">
            Sold by <span className="font-medium">{product.farmer}</span>
          </p>

          {/* State */}
          <div className="mt-3 flex items-center gap-2 text-slate-600">
            <MapPin size={16} />
            <span>{product.state}</span>
          </div>

          {/* Rating & Price */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Star
                size={16}
                className="fill-yellow-400 text-yellow-400"
              />

              <span className="font-medium">
                {product.rating}
              </span>
            </div>

            <h4 className="text-2xl font-bold text-emerald-600">
              ₦{product.price.toLocaleString()}
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
              leftIcon={<ShoppingCart size={18} />}
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