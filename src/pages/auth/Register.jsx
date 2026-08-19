import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import AuthCard from "../../components/auth/AuthCard";
import AuthHeader from "../../components/auth/AuthHeader";
import AuthInput from "../../components/auth/AuthInput";

import { signUp } from "../../services/authService";

const schema = z
  .object({
    fullName: z.string().min(3, "Full name is required"),

    email: z.string().email("Enter a valid email"),

    phone: z
      .string()
      .min(11, "Enter a valid phone number"),

    role: z.enum(["buyer", "farmer"]),

    password: z
      .string()
      .min(6, "Password must be at least 6 characters"),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const Register = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      role: "buyer",
    },
  });

  const onSubmit = async (values) => {
    const res = await signUp({
      fullName: values.fullName,
      email: values.email,
      phone: values.phone,
      password: values.password,
      role: values.role,
    });

    console.debug('Register result:', res);

    const { error, upsertError, signInResult } = res || {};

    if (error) {
      toast.error(error.message || "Unable to create account");
      return;
    }

    if (upsertError) {
      console.error("Profile upsert error:", upsertError);
      toast.error("Account created but profile could not be created. Contact support.");
      navigate("/auth/login");
      return;
    }

    if (signInResult?.error) {
      // Sign up succeeded but sign-in failed (likely email confirmation required)
      toast.success("Account created. Please confirm your email before login.");
      navigate("/auth/login");
      return;
    }

    // Signed in successfully
    toast.success("Account created and signed in.");
    navigate("/");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-10">
      <AuthCard>
        <AuthHeader
          title="Create Account"
          subtitle="Join FarmLink NG today"
        />

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
        >
          <AuthInput
            label="Full Name"
            placeholder="John Doe"
            error={errors.fullName?.message}
            {...register("fullName")}
          />

          <AuthInput
            label="Email"
            type="email"
            placeholder="john@example.com"
            error={errors.email?.message}
            {...register("email")}
          />

          <AuthInput
            label="Phone Number"
            placeholder="08012345678"
            error={errors.phone?.message}
            {...register("phone")}
          />

          <div>
            <label className="mb-2 block font-medium">
              Register As
            </label>

            <select
              {...register("role")}
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            >
              <option value="buyer">Buyer</option>
              <option value="farmer">Farmer</option>
            </select>
          </div>

          <AuthInput
            label="Password"
            type="password"
            error={errors.password?.message}
            {...register("password")}
          />

          <AuthInput
            label="Confirm Password"
            type="password"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-emerald-600 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </button>

          <p className="text-center text-sm">
            Already have an account?{" "}
            <Link
              to="/auth/login"
              className="font-semibold text-emerald-600"
            >
              Login
            </Link>
          </p>
        </form>
      </AuthCard>
    </div>
  );
};

export default Register;