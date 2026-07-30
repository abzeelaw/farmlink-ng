import {
  Truck,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";

const DeliveryInfo = () => {
  const items = [
    {
      icon: Truck,
      title: "Fast Delivery",
      text: "Delivery within 24–72 hours.",
    },
    {
      icon: ShieldCheck,
      title: "Secure Payment",
      text: "Protected by Paystack.",
    },
    {
      icon: RotateCcw,
      title: "Quality Guarantee",
      text: "Fresh produce or your money back.",
    },
  ];

  return (
    <div className="mt-10 rounded-3xl bg-slate-50 p-6">
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.title}
            className="mb-5 flex gap-4"
          >
            <Icon className="text-emerald-600" />

            <div>
              <h4 className="font-semibold">
                {item.title}
              </h4>

              <p className="text-slate-500">
                {item.text}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DeliveryInfo;