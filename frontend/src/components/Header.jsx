import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useState } from "react";

function Header() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const linkClass = ({ isActive }) =>
    isActive
      ? "block w-full rounded-xl bg-white/10 px-4 py-3 text-sm text-white"
      : "block w-full rounded-xl px-4 py-3 text-sm text-slate-400 hover:bg-white/10 transition";

  return (
    <header className="fixed top-0 left-0 w-full bg-black/70 backdrop-blur-md border-b border-white/10 z-50">
      <div className="mx-auto max-w-7xl h-16 px-6 flex items-center justify-between">
        {/* LOGO */}
        <h1 className="text-xl font-semibold tracking-tight text-white">
          Jobify
        </h1>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex gap-8 text-sm font-medium">
          <NavLink to="/home" className={({ isActive }) => isActive ? "text-white" : "text-slate-400 hover:text-white transition"}>
            Home
          </NavLink>
          <NavLink to="/apply" className={({ isActive }) => isActive ? "text-white" : "text-slate-400 hover:text-white transition"}>
            Apply
          </NavLink>
          <NavLink to="/profile" className={({ isActive }) => isActive ? "text-white" : "text-slate-400 hover:text-white transition"}>
            Profile
          </NavLink>
        </nav>

        {/* DESKTOP LOGOUT */}
        <button
          onClick={handleLogout}
          className="hidden md:block bg-red-500/90 text-white px-4 py-2 rounded-xl text-sm hover:bg-red-600 transition shadow-sm"
        >
          Logout
        </button>

        {/* MOBILE MENU BUTTON */}
        <button
          className="md:hidden text-2xl text-white"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>
      </div>

      {/* MOBILE DROPDOWN */}
      {open && (
        <div className="md:hidden bg-black/90 backdrop-blur border-t border-white/10">
          <div className="px-4 py-4 space-y-3">
            <NavLink to="/home" className={linkClass} onClick={() => setOpen(false)}>Home</NavLink>
            <NavLink to="/apply" className={linkClass} onClick={() => setOpen(false)}>Apply</NavLink>
            <NavLink to="/profile" className={linkClass} onClick={() => setOpen(false)}>Profile</NavLink>

            <button
              onClick={handleLogout}
              className="mt-2 w-full rounded-xl bg-red-500/90 py-2 text-sm text-white hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
