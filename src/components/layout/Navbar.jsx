import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  Menu,
  X,
  Search,
  Leaf,
} from "lucide-react";

import CartBadge from "../cart/CartBadge";
import UserMenu from "./UserMenu";
import Logo from "../../assets/images/navbar/logo.png";
import { useAuth } from "../../context/AuthContext";


const Navbar = () => {
   const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  

console.log(user);

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

  return (
    <header className="sticky top-3 z-50 border-b rounded-2xl mx-5 border-slate-200 bg-white/90 backdrop-blur-lg">
      <div className="container-width">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}

          <Link
            to="/"
            className="flex items-center gap-3"
          >
            <div className="flex h-20 w-28 items-center justify-center rounded-xl">
              <img src={Logo} alt="FarmLinks Logo"
                // size={24}
                // className="text-white"
              />
            </div>

            {/* <div>
              <h2 className="text-2xl font-bold text-slate-900">
                FarmLink
              </h2>

              <p className="-mt-1 text-xs text-slate-500">
                Fresh From Farmers
              </p>
            </div> */}
          </Link>

          {/* Desktop Navigation */}

          <nav className="hidden items-center gap-10 lg:flex">
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

          {/* Right Side */}

          <div className="hidden items-center gap-3 lg:flex">
            <button className="flex h-11 w-11 items-center justify-center rounded-full transition hover:bg-emerald-100">
              <Search
                size={22}
                className="text-slate-700"
              />
            </button>

            <CartBadge />

            <UserMenu />
          </div>

          {/* Mobile Menu Button */}

          <button
            onClick={() =>
              setMobileMenuOpen(!mobileMenuOpen)
            }
            className="lg:hidden"
          >
            {mobileMenuOpen ? (
              <X size={30} />
            ) : (
              <Menu size={30} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}

        {mobileMenuOpen && (
          <div className="border-t border-slate-200 py-6 lg:hidden">
            <nav className="flex flex-col gap-5">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={() =>
                    setMobileMenuOpen(false)
                  }
                  className={({ isActive }) =>
                    `font-medium ${
                      isActive
                        ? "text-emerald-600"
                        : "text-slate-700"
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}

              <div className="mt-4 flex items-center gap-4">
                <CartBadge />

                <UserMenu />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;