import React from "react";
import { Link, useLocation } from "react-router";
import { Pencil, LogOut } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  
  // Determine profile based on current route
  const getProfileData = () => {
    if (location.pathname === '/apoteker') {
      return {
        initial: 'Y',
        name: 'Apt. Yanti',
        id: 'APT001',
        role: 'Apoteker'
      };
    } else if (location.pathname === '/doctor') {
      return {
        initial: 'Y',
        name: 'Dr. Yanto',
        id: 'DOC001',
        role: 'Dokter'
      };
    } else if (location.pathname === '/pasien') {
      return {
        initial: 'Y',
        name: 'Yanto',
        id: 'PAT001',
        role: 'Pasien'
      };
    } else if (location.pathname === '/admin') {
      return {
        initial: 'A',
        name: 'Admin User',
        id: 'ADM001',
        role: 'Administrator'
      };
    }
    
    // Default profile
    return {
      initial: 'Y',
      name: 'Dr. Yanto',
      id: 'DOC001',
      role: 'Dokter'
    };
  };
  
  const profile = getProfileData();
  return (
    <header className="bg-base-100 shadow-sm border-b border-base-300">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        
        {/* LEFT — LOGO */}
        <Link to="/" className="flex items-center gap-3">
          <div className="bg-emerald-500 text-white p-3 rounded-xl flex items-center justify-center">
            <Pencil size={20} />
          </div>
          <h1 className="text-xl font-bold text-emerald-600 tracking-tight">
            DRUG TWIN
          </h1>
        </Link>

        {/* RIGHT — PROFILE + ROLE + BUTTON */}
        <div className="flex items-center gap-4">
          
          {/* Avatar */}
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-semibold">
              {profile.initial}
            </div>

            <div className="leading-tight">
              <p className="font-semibold text-sm">{profile.name}</p>
              <p className="text-xs opacity-60">{profile.id}</p>
            </div>
          </div>

          {/* Role */}
          <span className="bg-emerald-500 text-white px-3 py-1 rounded-lg text-sm font-medium">
            {profile.role}
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