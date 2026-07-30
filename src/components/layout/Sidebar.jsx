import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";

const Sidebar = () => {
  return (
    <aside className="w-64 border-r">
      <Link
  to="/farmer/orders"
  className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-600 transition hover:bg-emerald-50 hover:text-emerald-600"
>
  <ShoppingBag size={20} />

  <span>Orders</span>
</Link>
    </aside>
  );
};

export default Sidebar;