import { Star, MapPin, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { Button } from "../ui";
import QuantitySelector from "./QuantitySelector";
import { useCart } from "../../context/CartContext";

const ProductInfo = ({
  product,
  quantity,
  setQuantity,
}) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`${product.name} added to cart`);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate("/cart");
  };

  return (
    <div>
      {/* Category */}
      <span className="inline-flex rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
        {product.category}
      </span>

      {/* Product Name */}
      <h1 className="mt-5 text-4xl font-bold text-slate-900 lg:text-5xl">
        {product.name}
      </h1>

      {/* Rating & Location */}
      <div className="mt-5 flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-2">
          <Star
            size={18}
            className="fill-yellow-400 text-yellow-400"
          />
          <span className="font-semibold">
            {product.rating || 5.0}
          </span>
        </div>

        <div className="flex items-center gap-2 text-slate-600">
          <MapPin size={18} />
          <span>
            {product.city}, {product.state}
          </span>
        </div>
      </div>

      {/* Price */}
      <h2 className="mt-8 text-4xl font-bold text-emerald-600">
        ₦{Number(product.price).toLocaleString()}
      </h2>

      {/* Farmer */}
      <div className="mt-8 rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
        <div className="flex items-center gap-3">
          <ShieldCheck className="text-emerald-600" />

          <div>
            <h4 className="font-semibold">
              Verified Farmer
            </h4>

            <p className="text-slate-600">
              {product.farmer}
            </p>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mt-8">
        <h3 className="mb-3 text-xl font-semibold">
          Description
        </h3>

        <p className="leading-8 text-slate-600">
          {product.description}
        </p>
      </div>

      {/* Quantity */}
      <QuantitySelector
        quantity={quantity}
        setQuantity={setQuantity}
      />

      {/* Buttons */}
      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <Button
          className="flex-1"
          onClick={handleAddToCart}
        >
          Add to Cart
        </Button>

        <Button
          variant="outline"
          className="flex-1"
          onClick={handleBuyNow}
        >
          Buy Now
        </Button>
      </div>

      {/* Extra Information */}
      <div className="mt-10 space-y-4 rounded-2xl bg-slate-50 p-6">
        <div className="flex justify-between">
          <span className="font-medium text-slate-600">
            Availability
          </span>

          <span
            className={`font-semibold ${
              product.stock > 0
                ? "text-emerald-600"
                : "text-red-600"
            }`}
          >
            {product.stock > 0
              ? `${product.stock} Available`
              : "Out of Stock"}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="font-medium text-slate-600">
            Delivery
          </span>

          <span>24–72 Hours</span>
        </div>

        <div className="flex justify-between">
          <span className="font-medium text-slate-600">
            Payment
          </span>

          <span>Paystack Secure Payment</span>
        </div>

        <div className="flex justify-between">
          <span className="font-medium text-slate-600">
            Seller
          </span>

          <span>{product.farmer}</span>
        </div>

        <div className="flex justify-between">
          <span className="font-medium text-slate-600">
            Category
          </span>

          <span>{product.category}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;