
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useCheckout } from "../../context/CheckoutContext";
import { useAuth } from "../../context/AuthContext";

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
  const { user, profile } = useAuth();

  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: checkoutData,
    mode: "onChange",
  });

  /*
    =========================================
    AUTO-FILL LOGGED-IN USER INFORMATION
    =========================================
  */

  useEffect(() => {
    if (!user) return;

    const fullName =
      profile?.full_name ||
      user.user_metadata?.full_name ||
      "";

    const email = user.email || "";

    if (fullName) {
      setValue("fullName", fullName);
    }

    if (email) {
      setValue("email", email);
    }
  }, [user, profile, setValue]);

  /*
    =========================================
    WATCH FORM VALUES
    =========================================
  */

  const values = useWatch({
    control,
  });

  /*
    =========================================
    SAVE CHECKOUT DATA
    =========================================
  */

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

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">
          Delivery Information
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Enter the information needed to deliver your order.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">

        {/* =====================================
            FULL NAME
        ====================================== */}

        <div>
          <label className="mb-2 block font-medium">
            Full Name
          </label>

          <input
            {...register("fullName")}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500"
            placeholder="John Doe"
          />

          {errors.fullName && (
            <p className="mt-1 text-sm text-red-500">
              {errors.fullName.message}
            </p>
          )}
        </div>

        {/* =====================================
            EMAIL
        ====================================== */}

        <div>
          <label className="mb-2 block font-medium">
            Email Address
          </label>

          <input
            type="email"
            {...register("email")}
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-emerald-500"
            placeholder="john@email.com"
            readOnly={!!user}
          />

          {errors.email && (
            <p className="mt-1 text-sm text-red-500">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* =====================================
            PHONE
        ====================================== */}

        <div>
          <label className="mb-2 block font-medium">
            Phone Number
          </label>

          <input
            {...register("phone")}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500"
            placeholder="08012345678"
          />

          {errors.phone && (
            <p className="mt-1 text-sm text-red-500">
              {errors.phone.message}
            </p>
          )}
        </div>

        {/* =====================================
            STATE
        ====================================== */}

        <div>
          <label className="mb-2 block font-medium">
            State
          </label>

          <input
            {...register("state")}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500"
            placeholder="Kaduna"
          />

          {errors.state && (
            <p className="mt-1 text-sm text-red-500">
              {errors.state.message}
            </p>
          )}
        </div>

        {/* =====================================
            CITY
        ====================================== */}

        <div>
          <label className="mb-2 block font-medium">
            City
          </label>

          <input
            {...register("city")}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500"
            placeholder="Zaria"
          />

          {errors.city && (
            <p className="mt-1 text-sm text-red-500">
              {errors.city.message}
            </p>
          )}
        </div>

        {/* =====================================
            DELIVERY ADDRESS
        ====================================== */}

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

          {errors.address && (
            <p className="mt-1 text-sm text-red-500">
              {errors.address.message}
            </p>
          )}
        </div>

        {/* =====================================
            NOTES
        ====================================== */}

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

      {/* =====================================
          ROLE INFORMATION
      ====================================== */}

      {user && (
        <div className="mt-6 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3">

          <p className="text-sm text-emerald-700">
            You are checking out as{" "}
            <span className="font-semibold">
              {profile?.role === "farmer"
                ? "Farmer"
                : "Buyer"}
            </span>
            .
          </p>

        </div>
      )}

    </div>
  );
};

export default CheckoutForm;