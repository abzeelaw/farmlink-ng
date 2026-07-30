import { NavLink } from "react-router-dom";
import { navLinks } from "../../constants/navigation";

const NavLinks = ({ mobile = false, onClick }) => {
  return (
    <>
      {navLinks.map((link) => (
        <NavLink
          key={link.name}
          to={link.path}
          onClick={onClick}
          className={({ isActive }) =>
            `
              transition-all duration-300
              ${
                mobile
                  ? "block py-3 text-lg"
                  : "relative"
              }
              ${
                isActive
                  ? "text-emerald-600 font-semibold"
                  : "text-slate-700 hover:text-emerald-600"
              }
            `
          }
        >
          {link.name}
        </NavLink>
      ))}
    </>
  );
};

export default NavLinks;