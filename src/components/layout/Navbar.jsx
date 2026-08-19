
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  Search,
  User,
  UserCircle,
  LogOut,
  LayoutDashboard,
  ShoppingBag,
} from "lucide-react";
import toast from "react-hot-toast";

import CartBadge from "../cart/CartBadge";
import Logo from "../../assets/images/navbar/logo.png";

import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";

const Navbar = () => {
  const { user, profile, loading } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const [userMenuOpen, setUserMenuOpen] =
    useState(false);

  const navigate = useNavigate();

  /* =========================================
     NAVIGATION LINKS
  ========================================= */

  const navLinks = [
    {
      name: "Home",
      path: "/",
    },
    {
      name: "Marketplace",
      path: "/marketplace",
    },
    {
      name: "About",
      path: "/about",
    },
    {
      name: "Contact",
      path: "/contact",
    },
  ];

  /* =========================================
     USER ROLE
  ========================================= */

  const role = profile?.role?.toLowerCase();

  const roleLabel = !user
    ? "Guest"
    : role === "farmer"
    ? "Farmer"
    : "Buyer";

  /* =========================================
     USER DISPLAY NAME
  ========================================= */

  const displayName =
    profile?.full_name ||
    user?.email?.split("@")[0] ||
    "Guest";

  /* =========================================
     LOGOUT
  ========================================= */

  const handleLogout = async () => {
    const { error } =
      await supabase.auth.signOut();

    if (error) {
      console.error(
        "Logout error:",
        error
      );

      toast.error(
        "Unable to sign out."
      );

      return;
    }

    setUserMenuOpen(false);
    setMobileMenuOpen(false);

    toast.success(
      "Signed out successfully."
    );

    navigate("/");
  };

  return (
    <header className="sticky top-3 z-50 mx-3 rounded-2xl border border-slate-200 bg-white/90 shadow-sm backdrop-blur-lg sm:mx-5">

      <div className="container-width">

        {/* =====================================
            MAIN NAVBAR
        ====================================== */}

        <div className="flex h-20 items-center justify-between px-2">

          {/* LOGO */}

          <Link
            to="/"
            onClick={() =>
              setMobileMenuOpen(false)
            }
            className="flex shrink-0 items-center"
          >
            <div className="flex h-20 w-24 items-center justify-center sm:w-28">

              <img
                src={Logo}
                alt="FarmLink Logo"
                className="max-h-16 w-auto object-contain"
              />

            </div>
          </Link>


          {/* ===================================
              DESKTOP NAVIGATION
          ==================================== */}

          <nav className="hidden items-center gap-8 lg:flex xl:gap-10">

            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `font-medium transition ${
                    isActive
                      ? "text-emerald-600"
                      : "text-slate-700 hover:text-emerald-600"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}

          </nav>


          {/* ===================================
              RIGHT SIDE
          ==================================== */}

          <div className="flex items-center gap-1.5 sm:gap-3">

            {/* SEARCH */}

            <button
              type="button"
              onClick={() => {
                // Prompt for a query and navigate to marketplace with query param
                const q = window.prompt("Search for products, farmers or locations:");

                if (q && q.trim() !== "") {
                  navigate(`/marketplace?q=${encodeURIComponent(q.trim())}`);
                } else {
                  navigate("/marketplace");
                }
              }}
              className="hidden h-11 w-11 items-center justify-center rounded-full transition hover:bg-emerald-100 lg:flex"
              aria-label="Search"
            >
              <Search size={22} className="text-slate-700" />
            </button>


            {/* CART */}

            <CartBadge />


            {/* =================================
                AUTH USER
            ================================== */}

            {loading ? (

              <div className="flex h-10 w-10 items-center justify-center">
                <User
                  size={21}
                  className="text-slate-400"
                />
              </div>

            ) : !user ? (

              /* =================================
                 GUEST
              ================================== */

              <div className="flex items-center gap-1 sm:gap-2">

                {/* Guest label */}

                <div className="hidden items-center gap-2 md:flex">

                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100">

                    <User
                      size={19}
                      className="text-slate-500"
                    />

                  </div>

                  <span className="text-sm font-semibold text-slate-600">
                    Guest
                  </span>

                </div>


                {/* Login */}

                <Link
                  to="auth/Login"
                  className="hidden rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-600 sm:block"
                >
                  Login
                </Link>


                {/* Sign Up */}

                <Link
                  to="auth/register"
                  className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  Sign Up
                </Link>

              </div>

            ) : (

              /* =================================
                 LOGGED-IN USER
              ================================== */

              <div className="relative">

                {/* USER BUTTON */}

                <button
                  type="button"
                  onClick={() =>
                    setUserMenuOpen(
                      !userMenuOpen
                    )
                  }
                  className="flex items-center gap-2 rounded-full p-1.5 transition hover:bg-emerald-50"
                  aria-label="Open user menu"
                  aria-expanded={
                    userMenuOpen
                  }
                >

                  {/* Avatar */}

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100">

                    <User
                      size={20}
                      className="text-emerald-600"
                    />

                  </div>


                  {/* Name + Role */}

                  <div className="hidden text-left md:block">

                    <p className="max-w-[120px] truncate text-sm font-semibold text-slate-800">
                      {displayName}
                    </p>

                    <p className="text-xs font-medium text-emerald-600">
                      {roleLabel}
                    </p>

                  </div>

                </button>


                {/* =================================
                    USER DROPDOWN
                ================================== */}

                {userMenuOpen && (

                  <div className="absolute right-0 top-12 z-[100] w-64 rounded-xl border border-slate-200 bg-white p-3 shadow-xl">

                    {/* USER INFORMATION */}

                    <div className="border-b border-slate-100 px-3 pb-3">

                      <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100">

                          <UserCircle
                            size={24}
                            className="text-emerald-600"
                          />

                        </div>

                        <div className="min-w-0">

                          <p className="truncate font-semibold text-slate-900">
                            {displayName}
                          </p>

                          <p className="text-xs font-semibold text-emerald-600">
                            {roleLabel}
                          </p>

                          <p className="truncate text-xs text-slate-500">
                            {user.email}
                          </p>

                        </div>

                      </div>

                    </div>


                    {/* =================================
                        FARMER DASHBOARD
                    ================================== */}

                    {role === "farmer" && (

                      <Link
                        to="/farmer/dashboard"
                        onClick={() =>
                          setUserMenuOpen(
                            false
                          )
                        }
                        className="mt-2 flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-600"
                      >

                        <LayoutDashboard
                          size={18}
                        />

                        Farmer Dashboard

                      </Link>

                    )}


                    {/* =================================
                        MY ORDERS
                    ================================== */}

                    <Link
                      to="/orders"
                      onClick={() =>
                        setUserMenuOpen(
                          false
                        )
                      }
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-600"
                    >

                      <ShoppingBag
                        size={18}
                      />

                      My Orders

                    </Link>


                    {/* =================================
                        SIGN OUT
                    ================================== */}

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                    >

                      <LogOut
                        size={18}
                      />

                      Sign Out

                    </button>

                  </div>

                )}

              </div>

            )}


            {/* =================================
                MOBILE MENU BUTTON
            ================================== */}

            <button
              type="button"
              onClick={() =>
                setMobileMenuOpen(
                  !mobileMenuOpen
                )
              }
              className="rounded-lg p-2 transition hover:bg-slate-100 lg:hidden"
              aria-label={
                mobileMenuOpen
                  ? "Close navigation menu"
                  : "Open navigation menu"
              }
              aria-expanded={
                mobileMenuOpen
              }
            >

              {mobileMenuOpen ? (
                <X size={27} />
              ) : (
                <Menu size={27} />
              )}

            </button>

          </div>

        </div>


        {/* =====================================
            MOBILE / TABLET MENU
        ====================================== */}

        {mobileMenuOpen && (

          <div className="border-t border-slate-200 px-4 py-6 lg:hidden">

            <nav className="flex flex-col gap-5">

              {navLinks.map((link) => (

                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={() =>
                    setMobileMenuOpen(
                      false
                    )
                  }
                  className={({ isActive }) =>
                    `font-medium transition ${
                      isActive
                        ? "text-emerald-600"
                        : "text-slate-700 hover:text-emerald-600"
                    }`
                  }
                >
                  {link.name}
                </NavLink>

              ))}

            </nav>


            {/* =================================
                MOBILE USER INFORMATION
            ================================== */}

            <div className="mt-6 border-t border-slate-200 pt-5">

              {!user ? (

                <div className="flex flex-col gap-3">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">

                      <User
                        size={20}
                        className="text-slate-500"
                      />

                    </div>

                    <div>

                      <p className="font-semibold text-slate-800">
                        Guest
                      </p>

                      <p className="text-xs text-slate-500">
                        Not logged in
                      </p>

                    </div>

                  </div>


                  <Link
                    to="/auth"
                    onClick={() =>
                      setMobileMenuOpen(
                        false
                      )
                    }
                    className="rounded-lg border border-emerald-600 px-4 py-2 text-center font-semibold text-emerald-600"
                  >
                    Login
                  </Link>


                  <Link
                    to="/auth"
                    onClick={() =>
                      setMobileMenuOpen(
                        false
                      )
                    }
                    className="rounded-lg bg-emerald-600 px-4 py-2 text-center font-semibold text-white"
                  >
                    Sign Up
                  </Link>

                </div>

              ) : (

                <div className="space-y-3">

                  {/* Mobile User */}

                  <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100">

                      <User
                        size={21}
                        className="text-emerald-600"
                      />

                    </div>

                    <div className="min-w-0">

                      <p className="truncate font-semibold text-slate-900">
                        {displayName}
                      </p>

                      <p className="text-sm font-semibold text-emerald-600">
                        {roleLabel}
                      </p>

                    </div>

                  </div>


                  {/* Farmer Dashboard */}

                  {role === "farmer" && (

                    <Link
                      to="/farmer/dashboard"
                      onClick={() =>
                        setMobileMenuOpen(
                          false
                        )
                      }
                      className="flex items-center gap-3 rounded-lg px-3 py-2 font-medium text-slate-700 hover:bg-emerald-50"
                    >

                      <LayoutDashboard
                        size={19}
                      />

                      Farmer Dashboard

                    </Link>

                  )}


                  {/* My Orders */}

                  <Link
                    to="/orders"
                    onClick={() =>
                      setMobileMenuOpen(
                        false
                      )
                    }
                    className="flex items-center gap-3 rounded-lg px-3 py-2 font-medium text-slate-700 hover:bg-emerald-50"
                  >

                    <ShoppingBag
                      size={19}
                    />

                    My Orders

                  </Link>


                  {/* Sign Out */}

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 font-medium text-red-600 hover:bg-red-50"
                  >

                    <LogOut
                      size={19}
                    />

                    Sign Out

                  </button>

                </div>

              )}

            </div>

          </div>

        )}

      </div>

    </header>
  );
};

export default Navbar;