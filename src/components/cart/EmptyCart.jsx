import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "../ui";

const EmptyCart = () => {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="mb-8 flex h-28 w-28 items-center justify-center rounded-full bg-emerald-100">
        <ShoppingCart
          size={52}
          className="text-emerald-600"
        />
      </div>

      <h2 className="text-4xl font-bold text-slate-900">
        Your cart is empty
      </h2>

      <p className="mt-4 max-w-md text-lg text-slate-500">
        Looks like you haven't added any fresh farm produce yet.
        Browse our marketplace and start shopping.
      </p>

      <Link
        to="/marketplace"
        className="mt-8"
      >
        <Button>
          Continue Shopping
        </Button>
      </Link>
    </div>
  );
};

export default EmptyCart;