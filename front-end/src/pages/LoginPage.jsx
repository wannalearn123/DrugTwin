import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn } from 'lucide-react';

const LoginPage = () => {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await login(form.email, form.password);
      console.log('Login result:', result); // DEBUG
      
      if (!result.success) {
        setLoading(false);
      }
      // Keep loading state true until redirect happens
    } catch (error) {
      console.error('Submit error:', error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-emerald-100">
      <div className="card w-96 bg-white shadow-xl">
        <div className="card-body">
          <div className="flex justify-center mb-4">
            <LogIn className="w-16 h-16 text-primary" />
          </div>
          <h2 className="text-3xl font-bold text-center mb-6">Drug Twin</h2>
          
          <form onSubmit={submit}>
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                className="input input-bordered"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                disabled={loading}
              />
            </div>
            
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                className="input input-bordered"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                disabled={loading}
              />
            </div>

            <div className="text-center mb-6">
              <Link 
                to="/forgot-password"
                className="link link-primary text-sm hover:link-hover"
              >
                Lupa password?
              </Link>
            </div>
            
            <button className="btn btn-primary w-full" disabled={loading}>
              {loading ? (
                <>
                  <span className="loading loading-spinner"></span>
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;