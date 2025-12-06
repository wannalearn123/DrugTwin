import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { authAPI } from '../api/authAPI';
import { useAuth } from '../context/AuthContext';
import { Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [token, setToken] = useState('');

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (!tokenFromUrl) {
      toast.error('Invalid or missing reset token');
      navigate('/forgot-password');
      return;
    }
    setToken(tokenFromUrl);
  }, [searchParams, navigate]);

  const submit = async (e) => {
    e.preventDefault();
    
    if (form.newPassword !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (form.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    
    try {
      const result = await authAPI.resetPassword({
        token,
        newPassword: form.newPassword
      });
      
      console.log('Reset password result:', result);
      
      if (result.status === 'success') {
        toast.success('Password reset successful! Logging you in...');
        
        // Auto login with new credentials
        localStorage.setItem('authToken', result.token);
        
        // Redirect based on user role
        const userRole = result.data.user.role;
        setTimeout(() => {
          switch (userRole) {
            case 'admin':
              navigate('/admin');
              break;
            case 'doctor':
              navigate('/doctor');
              break;
            case 'pharmacist':
              navigate('/apotek');
              break;
            case 'patient':
              navigate('/pasien');
              break;
            default:
              navigate('/');
          }
        }, 1000);
      }
    } catch (error) {
      console.error('Reset password error:', error);
      toast.error(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-emerald-100">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-emerald-100">
      <div className="card w-96 bg-white shadow-xl">
        <div className="card-body">
          <div className="flex justify-center mb-4">
            <Lock className="w-16 h-16 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-center mb-2">Reset Password</h2>
          <p className="text-center text-gray-600 mb-6">
            Enter your new password below.
          </p>
          
          <form onSubmit={submit}>
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">New Password</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input input-bordered w-full pr-10"
                  value={form.newPassword}
                  onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                  placeholder="Enter new password"
                  required
                  disabled={loading}
                  minLength={8}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-gray-400" />
                  ) : (
                    <Eye className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div className="form-control mb-6">
              <label className="label">
                <span className="label-text">Confirm New Password</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="input input-bordered w-full pr-10"
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  placeholder="Confirm new password"
                  required
                  disabled={loading}
                  minLength={8}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4 text-gray-400" />
                  ) : (
                    <Eye className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {form.newPassword && form.confirmPassword && form.newPassword !== form.confirmPassword && (
              <div className="alert alert-error mb-4">
                <span className="text-sm">Passwords do not match</span>
              </div>
            )}
            
            <button className="btn btn-primary w-full mb-4" disabled={loading || form.newPassword !== form.confirmPassword}>
              {loading ? (
                <>
                  <span className="loading loading-spinner"></span>
                  Resetting...
                </>
              ) : (
                'Reset Password'
              )}
            </button>
          </form>
          
          <Link to="/" className="btn btn-ghost w-full">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;