import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";

const CartBadge = () => {
  const { totalItems } = useCart();

  return (
    <Link
      to="/cart"
      className="relative flex h-11 w-11 items-center justify-center rounded-full transition hover:bg-emerald-100"
    >
      <ShoppingCart
        size={22}
        className="text-slate-700"
      />

      {totalItems > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
          {totalItems}
        </span>
      )}
    </Link>
  );
};

export default CartBadge;