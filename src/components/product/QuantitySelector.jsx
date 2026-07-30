import { Minus, Plus } from "lucide-react";

const QuantitySelector = ({ quantity, setQuantity }) => {
  return (
    <div className="mt-8">
      <h3 className="mb-3 font-semibold">Quantity</h3>

      <div className="flex w-fit items-center gap-5 rounded-xl border px-5 py-3">
        <button
          onClick={() =>
            quantity > 1 &&
            setQuantity(quantity - 1)
          }
        >
          <Minus size={18} />
        </button>

        <span className="text-lg font-bold">
          {quantity}
        </span>

        <button
          onClick={() =>
            setQuantity(quantity + 1)
          }
        >
          <Plus size={18} />
        </button>
      </div>
    </div>
  );
};

export default QuantitySelector;