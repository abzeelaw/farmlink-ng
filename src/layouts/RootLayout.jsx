
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const RootLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50">

      {/* Global Toast Notifications */}
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
        }}
      />

      {/* Navbar appears on every page */}
      <Navbar />

      {/* Page content */}
      <motion.main initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
        <Outlet />
      </motion.main>

      {/* Footer appears on every page */}
      <Footer />

    </div>
  );
};

export default RootLayout;