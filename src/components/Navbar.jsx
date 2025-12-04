import React from "react";
import { Link } from "react-router";
import { Pencil, LogOut } from "lucide-react";

const Navbar = () => {
  return (
    <header className="bg-base-100 shadow-sm border-b border-base-300">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        
        {/* LEFT — LOGO */}
        <Link to="/" className="flex items-center gap-3">
          <div className="bg-green-600 text-white p-3 rounded-xl flex items-center justify-center">
            <Pencil size={20} />
          </div>
          <h1 className="text-xl font-bold text-green-700 tracking-tight">
            DRUG TWIN
          </h1>
        </Link>

        {/* RIGHT — PROFILE + ROLE + BUTTON */}
        <div className="flex items-center gap-4">
          
          {/* Avatar */}
          <div className="flex items-center gap-3">
            <div className="bg-green-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-semibold">
              D
            </div>

            <div className="leading-tight">
              <p className="font-semibold text-sm">Dr. Yanto</p>
              <p className="text-xs opacity-60">ID User: DOC001</p>
            </div>
          </div>

          {/* Role */}
          <span className="btn btn-sm btn-success text-white">
            Dokter
          </span>

         {/* LOGOUT → LINK KE LOGIN */}
          <Link to="/login" className="btn btn-sm btn-outline flex items-center gap-2">
            Keluar <LogOut size={16} />
          </Link>
        </div>

      </div>
    </header>
  );
};

export default Navbar;