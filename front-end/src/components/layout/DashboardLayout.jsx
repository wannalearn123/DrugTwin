import { useAuth } from '../../context/AuthContext';
import { LogOut, Users, Stethoscope, User, UserCog } from 'lucide-react';
import { Link, useLocation } from 'react-router';

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <div className="min-h-screen bg-base-200">
      <div className="navbar bg-base-100 shadow-lg">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl">🏥 Drug Twin</a>
          
          <div className="hidden md:flex ml-4 gap-2">
            {user?.role === 'admin' && (
              <>
                <Link 
                  to="/admin/patients" 
                  className={`btn btn-ghost gap-2 ${isActive('/admin/patients') ? 'btn-active' : ''}`}
                >
                  <Users className="w-4 h-4" />
                  Patients
                </Link>
                <Link 
                  to="/admin/doctors" 
                  className={`btn btn-ghost gap-2 ${isActive('/admin/doctors') ? 'btn-active' : ''}`}
                >
                  <UserCog className="w-4 h-4" />
                  Doctors
                </Link>
              </>
            )}
            
            {user?.role === 'doctor' && (
              <Link 
                to="/doctor/dashboard" 
                className={`btn btn-ghost gap-2 ${isActive('/doctor/dashboard') ? 'btn-active' : ''}`}
              >
                <Stethoscope className="w-4 h-4" />
                My Patients
              </Link>
            )}
          </div>
        </div>

        <div className="flex-none gap-2">
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost gap-2">
              <User className="w-5 h-5" />
              <div className="text-left hidden md:block">
                <div className="text-sm font-semibold">{user?.name}</div>
                <div className="text-xs text-gray-500 capitalize">{user?.role}</div>
              </div>
            </div>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              <li className="menu-title">
                <span>{user?.email}</span>
              </li>
              <li>
                <button onClick={logout} className="text-error gap-2">
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <main className="container mx-auto">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;