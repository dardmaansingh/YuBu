import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const links = [
    { name: "Home", path: "/" },
    { name: "My Resumes", path: "/my-resumes" },
    { name: "Browse", path: "/browse" },
  ];

  return (
    <nav className="border-b border-neutral-800 bg-black/80 backdrop-blur sticky top-0 z-50 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-white text-black rounded-full flex items-center justify-center font-black text-lg tracking-tighter">
            Y
          </div>
          <span className="text-lg font-bold text-white tracking-tight hidden sm:inline">
            YuBu
          </span>
        </Link>

        <div className="flex items-center gap-1">
          {links.map((link) => {
            const active = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-full text-sm transition ${
                  active
                    ? "font-bold text-white bg-neutral-900"
                    : "text-neutral-400 hover:text-white hover:bg-neutral-900/60"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link
          to="/upload"
          className="hidden sm:inline-flex items-center px-4 py-1.5 bg-white text-black text-xs font-bold rounded-full hover:bg-neutral-200 transition"
        >
          + Upload
        </Link>

        <div className="flex items-center gap-2 pl-2 border-l border-neutral-800">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.fullName}
              className="w-8 h-8 rounded-full object-cover border border-neutral-700"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-xs font-bold text-white">
              {user?.fullName?.charAt(0).toUpperCase() || "U"}
            </div>
          )}
          <span className="text-xs text-neutral-300 font-medium hidden md:inline">
            {user?.fullName}
          </span>
        </div>

        <button
          onClick={logout}
          className="px-3.5 py-1.5 border border-neutral-700 hover:border-neutral-500 hover:bg-neutral-900 text-neutral-300 text-xs font-medium rounded-full transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};
