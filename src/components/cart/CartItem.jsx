import { Minus, Plus, Trash2, MapPin } from "lucide-react";
import { useCart } from "../../context/CartContext";

const CartItem = ({ item }) => {
  const {
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart();

  return (
    <div className="flex flex-col gap-6 rounded-3xl bg-white p-6 shadow-md transition hover:shadow-lg md:flex-row">
      {/* Product Image */}
      <div className="overflow-hidden rounded-2xl md:w-44">
        <img
          src={item.image}
          alt={item.name}
          className="h-40 w-full object-cover"
        />
      </div>

      {/* Product Details */}
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
            {item.category}
          </span>

          <h2 className="mt-3 text-2xl font-bold text-slate-800">
            {item.name}
          </h2>

          <p className="mt-2 text-slate-500">
            Sold by <span className="font-medium">{item.farmer}</span>
          </p>

          <div className="mt-2 flex items-center gap-2 text-slate-500">
            <MapPin size={16} />
            <span>{item.state}</span>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          {/* Quantity Controls */}
          <div className="flex items-center overflow-hidden rounded-xl border border-slate-200">
            <button
              onClick={() => decreaseQuantity(item.id)}
              className="p-3 transition hover:bg-slate-100"
            >
              <Minus size={18} />
            </button>

            <span className="min-w-12 text-center font-semibold">
              {item.quantity}
            </span>

            <button
              onClick={() => increaseQuantity(item.id)}
              className="p-3 transition hover:bg-slate-100"
            >
              <Plus size={18} />
            </button>
          </div>

          {/* Price */}
          <div className="text-right">
            <h3 className="text-2xl font-bold text-emerald-600">
              ₦{(item.price * item.quantity).toLocaleString()}
            </h3>

            <p className="text-sm text-slate-500">
              ₦{item.price.toLocaleString()} each
            </p>
          </div>

          {/* Remove */}
          <button
            onClick={() => removeFromCart(item.id)}
            className="rounded-xl bg-red-50 p-3 text-red-600 transition hover:bg-red-100"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;