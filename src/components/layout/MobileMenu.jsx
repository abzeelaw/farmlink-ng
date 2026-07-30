import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import NavLinks from "./NavLinks";
import Button from "../ui/Button";

const MobileMenu = ({ open, closeMenu }) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -25 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -25 }}
          transition={{ duration: 0.25 }}
          className="absolute left-0 top-full w-full border-t bg-white shadow-xl lg:hidden"
        >
          <div className="flex flex-col gap-4 p-6">
            <NavLinks
              mobile
              onClick={closeMenu}
            />

            <Button className="w-full">
              Login
            </Button>

            <Button
              variant="outline"
              className="w-full"
            >
              Register
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;