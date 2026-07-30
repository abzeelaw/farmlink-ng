import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen">
      <aside>
        Sidebar
      </aside>

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;