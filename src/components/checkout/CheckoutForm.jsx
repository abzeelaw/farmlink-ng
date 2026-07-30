import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useCheckout } from "../../context/CheckoutContext";

const checkoutSchema = z.object({
  fullName: z.string().min(3, "Full name is required"),
  email: z.email("Enter a valid email address"),
  phone: z
    .string()
    .min(11, "Phone number must be at least 11 digits"),
  state: z.string().min(2, "State is required"),
  city: z.string().min(2, "City is required"),
  address: z.string().min(10, "Enter a complete delivery address"),
  notes: z.string().optional(),
});

const CheckoutForm = () => {
  const { checkoutData, setCheckoutData } = useCheckout();

  const {
    register,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: checkoutData,
    mode: "onChange",
  });

  const values = watch();

  useEffect(() => {
    setCheckoutData(values);
  }, [values, setCheckoutData]);

  return (
    <div className="rounded-3xl bg-white p-8 shadow-lg">
      <h2 className="mb-8 text-2xl font-bold">
        Customer Information
      </h2>

      <div className="grid gap-6 md:grid-cols-2">

        <div>
          <label className="mb-2 block font-medium">
            Full Name
          </label>

          <input
            {...register("fullName")}
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
            placeholder="John Doe"
          />

          <p className="mt-1 text-sm text-red-500">
            {errors.fullName?.message}
          </p>
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Email Address
          </label>

          <input
            type="email"
            {...register("email")}
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
            placeholder="john@email.com"
          />

          <p className="mt-1 text-sm text-red-500">
            {errors.email?.message}
          </p>
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Phone Number
          </label>

          <input
            {...register("phone")}
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
            placeholder="08012345678"
          />

          <p className="mt-1 text-sm text-red-500">
            {errors.phone?.message}
          </p>
        </div>

        <div>
          <label className="mb-2 block font-medium">
            State
          </label>

          <input
            {...register("state")}
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
            placeholder="Kaduna"
          />

          <p className="mt-1 text-sm text-red-500">
            {errors.state?.message}
          </p>
        </div>

        <div>
          <label className="mb-2 block font-medium">
            City
          </label>

          <input
            {...register("city")}
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
            placeholder="Zaria"
          />

          <p className="mt-1 text-sm text-red-500">
            {errors.city?.message}
          </p>
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block font-medium">
            Delivery Address
          </label>

          <textarea
            rows={4}
            {...register("address")}
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
          />

          <p className="mt-1 text-sm text-red-500">
            {errors.address?.message}
          </p>
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block font-medium">
            Delivery Notes (Optional)
          </label>

          <textarea
            rows={3}
            {...register("notes")}
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
          />
        </div>

      </div>
    </div>
  );
};

export default CheckoutForm;