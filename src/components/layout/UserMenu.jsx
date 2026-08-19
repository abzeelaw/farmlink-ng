
import { useState } from "react";
import {
  User,
  LogOut,
  LayoutDashboard,
  ShoppingBag,
  ChevronDown,
  LogIn,
  UserPlus,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";

const UserMenu = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Sign out error:", error);
      toast.error("Unable to sign out");
      return;
    }

    setOpen(false);
    toast.success("Signed out successfully");

    navigate("/");
  };

  /* =========================================
     GUEST
  ========================================= */

  if (!user) {
    return (
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 rounded-xl px-3 py-2 transition hover:bg-emerald-50"
        >
          <User
            size={22}
            className="text-slate-700"
          />

          <div className="hidden sm:block text-left">
            <p className="text-xs text-slate-500">
              Account
            </p>

            <p className="text-sm font-semibold text-slate-800">
              Guest
            </p>
          </div>

          <ChevronDown
            size={16}
            className="text-slate-500"
          />
        </button>

        {open && (
          <div className="absolute right-0 top-full mt-3 w-52 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">

            <Link
              to="/auth/login"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-600"
            >
              <LogIn size={18} />

              Login
            </Link>

            <Link
              to="/auth/signup"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-600"
            >
              <UserPlus size={18} />

              Sign Up
            </Link>

          </div>
        )}
      </div>
    );
  }

  /* =========================================
     LOGGED-IN USER
  ========================================= */

  const role = profile?.role?.toLowerCase();

  const isFarmer = role === "farmer";
  const isAdmin = role === "admin";

  const displayName =
    profile?.full_name ||
    user.user_metadata?.full_name ||
    user.email?.split("@")[0] ||
    "User";

  return (
    <div className="relative">

      {/* USER BUTTON */}

      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-xl px-3 py-2 transition hover:bg-emerald-50"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
          <User
            size={21}
            className="text-emerald-700"
          />
        </div>

        <div className="hidden sm:block text-left">
          <p className="max-w-28 truncate text-sm font-semibold text-slate-800">
            {displayName}
          </p>

          <p className="text-xs font-medium capitalize text-emerald-600">
            {loading ? 'Loading...' : (role || 'buyer')}
          </p>
        </div>

        <ChevronDown
          size={16}
          className="text-slate-500"
        />
      </button>

      {/* DROPDOWN */}

      {open && (
        <div className="absolute right-0 top-full mt-3 w-64 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl">

          {/* USER INFORMATION */}

          <div className="border-b border-slate-100 px-3 pb-3">

            <p className="font-semibold text-slate-900">
              {displayName}
            </p>

            <p className="mt-1 truncate text-xs text-slate-500">
              {user.email}
            </p>

            <span className="mt-2 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold capitalize text-emerald-700">
              {loading ? 'Loading...' : (role || 'buyer')}
            </span>

          </div>

          {/* FARMER LINKS */}

          {isAdmin && !loading && (
            <>
              <Link
                to="/admin/farmers"
                onClick={() => setOpen(false)}
                className="mt-2 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-600"
              >
                <LayoutDashboard size={18} />

                Admin Dashboard
              </Link>

            </>
          )}

          {isFarmer && !loading && (
            <>
              <Link
                to="/farmer/dashboard"
                onClick={() => setOpen(false)}
                className="mt-2 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-600"
              >
                <LayoutDashboard size={18} />

                Farmer Dashboard
              </Link>

              <Link
                to="/farmer/orders"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-600"
              >
                <ShoppingBag size={18} />

                Farmer Orders
              </Link>
            </>
          )}

          {/* BUYER LINKS */}

          {!isFarmer && (
            <Link
              to="/orders"
              onClick={() => setOpen(false)}
              className="mt-2 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-600"
            >
              <ShoppingBag size={18} />

              My Orders
            </Link>
          )}

          {/* SIGN OUT */}

          <button
            onClick={handleSignOut}
            className="mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            <LogOut size={18} />

            Sign Out
          </button>

        </div>
      )}
    </div>
  );
};

export default UserMenu;