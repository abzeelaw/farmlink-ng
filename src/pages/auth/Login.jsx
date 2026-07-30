import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import AuthCard from "../../components/auth/AuthCard";
import AuthHeader from "../../components/auth/AuthHeader";
import AuthInput from "../../components/auth/AuthInput";

import { signIn } from "../../services/authService";

const Login = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (values) => {
    const { error } = await signIn({
      email: values.email,
      password: values.password,
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Login successful!");

    navigate("/");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-10">
      <AuthCard>
        <AuthHeader
          title="Welcome Back"
          subtitle="Login to your FarmLink NG account"
        />

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
        >
          <AuthInput
            label="Email"
            type="email"
            error={errors.email?.message}
            {...register("email", {
              required: "Email is required",
            })}
          />

          <AuthInput
            label="Password"
            type="password"
            error={errors.password?.message}
            {...register("password", {
              required: "Password is required",
            })}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-emerald-600 py-3 font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            {isSubmitting ? "Signing In..." : "Login"}
          </button>

          <div className="flex justify-between text-sm">
            <Link
              to="/auth/forgot-password"
              className="text-emerald-600"
            >
              Forgot Password?
            </Link>

            <Link
              to="/auth/register"
              className="text-emerald-600"
            >
              Create Account
            </Link>
          </div>
        </form>
      </AuthCard>
    </div>
  );
};

export default Login;