import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { authAPI } from '../api/authAPI';
import toast from 'react-hot-toast';

const AuthCtx = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('user');
    const tok = localStorage.getItem('authToken');
    if (stored && tok) setUser(JSON.parse(stored));
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await authAPI.login({ email, password });
      const { user: u, token } = res.data;
      
      console.log('Login response:', { user: u, token }); // DEBUG
      
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(u));
      setUser(u);
      
      toast.success(`Welcome ${u.name}!`);
      
      // Fix: Add delay and ensure navigation happens
      setTimeout(() => {
        if (u.role === 'admin') {
          console.log('Redirecting to admin...'); // DEBUG
          nav('/admin/patients', { replace: true });
        } else if (u.role === 'doctor') {
          console.log('Redirecting to doctor...'); // DEBUG
          nav('/doctor/dashboard', { replace: true });
        } else if (u.role === 'patient') {
          console.log('Redirecting to patient...'); // DEBUG
          nav('/patient/dashboard', { replace: true });
        } else {
          nav('/', { replace: true });
        }
      }, 100);
      
      return { success: true };
    } catch (e) {
      console.error('Login error:', e); // DEBUG
      toast.error(e.response?.data?.message || 'Login failed');
      return { success: false };
    }
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    nav('/login');
    toast.success('Logged out');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <AuthCtx.Provider value={{ user, login, logout, isAuth: !!user }}>
      {children}
    </AuthCtx.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error('useAuth needs AuthProvider');
  return ctx;
};