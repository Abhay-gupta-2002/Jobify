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
      ? "block w-full rounded-lg bg-gray-100 px-4 py-3 text-sm font-medium text-black"
      : "block w-full rounded-lg px-4 py-3 text-sm text-gray-600 hover:bg-gray-100 transition";

  return (
    <header className="fixed top-0 left-0 w-full bg-white border-b z-50">
      <div className="mx-auto max-w-7xl h-14 px-4 flex items-center justify-between">
        {/* LOGO */}
        <h1 className="text-lg font-bold">Jobify</h1>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex gap-8 text-sm font-medium">
          <NavLink to="/home" className={({ isActive }) => isActive ? "text-black" : "text-gray-500 hover:text-black"}>Home</NavLink>
          <NavLink to="/apply" className={({ isActive }) => isActive ? "text-black" : "text-gray-500 hover:text-black"}>Apply</NavLink>
          <NavLink to="/profile" className={({ isActive }) => isActive ? "text-black" : "text-gray-500 hover:text-black"}>Profile</NavLink>
        </nav>

        {/* DESKTOP LOGOUT */}
        <button
          onClick={handleLogout}
          className="hidden md:block bg-red-600 text-white px-3 py-1.5 rounded text-sm hover:bg-red-700 transition"
        >
          Logout
        </button>

        {/* MOBILE MENU BUTTON */}
        <button
          className="md:hidden text-xl"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>
      </div>

      {/* MOBILE DROPDOWN PANEL */}
      {open && (
        <div className="md:hidden bg-white border-t shadow-sm">
          <div className="px-4 py-4 space-y-3">
            <NavLink to="/home" className={linkClass} onClick={() => setOpen(false)}>
              Home
            </NavLink>
            <NavLink to="/apply" className={linkClass} onClick={() => setOpen(false)}>
              Apply
            </NavLink>
            <NavLink to="/profile" className={linkClass} onClick={() => setOpen(false)}>
              Profile
            </NavLink>

            <button
              onClick={handleLogout}
              className="mt-2 w-full rounded-lg bg-red-600 py-2 text-sm text-white hover:bg-red-700 transition"
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
