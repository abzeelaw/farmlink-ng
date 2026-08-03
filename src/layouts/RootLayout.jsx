
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";

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
      <main>
        <Outlet />
      </main>

      {/* Footer appears on every page */}
      <Footer />

    </div>
  );
};

export default RootLayout;