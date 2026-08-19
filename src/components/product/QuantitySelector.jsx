import { Minus, Plus } from "lucide-react";

const QuantitySelector = ({ quantity, setQuantity }) => {
  return (
    <div className="mt-6">
      <h3 className="mb-2 font-semibold">Quantity</h3>

      <div className="flex w-fit items-center gap-3 rounded-lg border px-3 py-2">
        <button
          onClick={() =>
            quantity > 1 &&
            setQuantity(quantity - 1)
          }
        >
          <Minus size={16} />
        </button>

        <span className="text-base font-bold">{quantity}</span>

        <button
          onClick={() =>
            setQuantity(quantity + 1)
          }
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
};

export default QuantitySelector;