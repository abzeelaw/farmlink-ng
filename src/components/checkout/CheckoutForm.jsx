import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
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
  address: z
    .string()
    .min(10, "Enter a complete delivery address"),
  notes: z.string().optional(),
});

const CheckoutForm = () => {
  const { checkoutData, setCheckoutData } = useCheckout();

  const {
    register,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: checkoutData,
    mode: "onChange",
  });

  const values = useWatch({
    control,
  });

  useEffect(() => {
    setCheckoutData((previousData) => {
      const hasChanged =
        JSON.stringify(previousData) !==
        JSON.stringify(values);

      return hasChanged ? values : previousData;
    });
  }, [values, setCheckoutData]);

  return (
    <div className="rounded-3xl bg-white p-8 shadow-lg">
      <h2 className="mb-8 text-2xl font-bold">
        Customer Information
      </h2>

      <div className="grid gap-6 md:grid-cols-2">

        {/* Full Name */}
        <div>
          <label className="mb-2 block font-medium">
            Full Name
          </label>

          <input
            {...register("fullName")}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500"
            placeholder="John Doe"
          />

          <p className="mt-1 text-sm text-red-500">
            {errors.fullName?.message}
          </p>
        </div>

        {/* Email */}
        <div>
          <label className="mb-2 block font-medium">
            Email Address
          </label>

          <input
            type="email"
            {...register("email")}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500"
            placeholder="john@email.com"
          />

          <p className="mt-1 text-sm text-red-500">
            {errors.email?.message}
          </p>
        </div>

        {/* Phone */}
        <div>
          <label className="mb-2 block font-medium">
            Phone Number
          </label>

          <input
            {...register("phone")}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500"
            placeholder="08012345678"
          />

          <p className="mt-1 text-sm text-red-500">
            {errors.phone?.message}
          </p>
        </div>

        {/* State */}
        <div>
          <label className="mb-2 block font-medium">
            State
          </label>

          <input
            {...register("state")}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500"
            placeholder="Kaduna"
          />

          <p className="mt-1 text-sm text-red-500">
            {errors.state?.message}
          </p>
        </div>

        {/* City */}
        <div>
          <label className="mb-2 block font-medium">
            City
          </label>

          <input
            {...register("city")}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500"
            placeholder="Zaria"
          />

          <p className="mt-1 text-sm text-red-500">
            {errors.city?.message}
          </p>
        </div>

        {/* Address */}
        <div className="md:col-span-2">
          <label className="mb-2 block font-medium">
            Delivery Address
          </label>

          <textarea
            rows={4}
            {...register("address")}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500"
            placeholder="Enter your complete delivery address"
          />

          <p className="mt-1 text-sm text-red-500">
            {errors.address?.message}
          </p>
        </div>

        {/* Notes */}
        <div className="md:col-span-2">
          <label className="mb-2 block font-medium">
            Delivery Notes (Optional)
          </label>

          <textarea
            rows={3}
            {...register("notes")}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500"
            placeholder="Any additional delivery instructions..."
          />
        </div>

      </div>
    </div>
  );
};

export default CheckoutForm;