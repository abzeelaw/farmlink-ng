import { User } from "lucide-react";
import { Link } from "react-router-dom";

const UserMenu = () => {
  return (
    <Link
      to="/auth/login"
      className="flex h-11 w-11 items-center justify-center rounded-full transition hover:bg-emerald-100"
    >
      <User
        size={22}
        className="text-slate-700"
      />
    </Link>
  );
};

export default UserMenu;