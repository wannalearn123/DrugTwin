import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../api/authAPI';
import { Mail, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [resetToken, setResetToken] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await authAPI.forgotPassword(email);
      console.log('Forgot password result:', result);
      
      if (result.status === 'success') {
        setSent(true);
        setResetToken(result.resetToken); // Development only
        toast.success('Password reset instructions sent to your email');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      toast.error(error.response?.data?.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-emerald-100">
        <div className="card w-96 bg-white shadow-xl">
          <div className="card-body text-center">
            <div className="flex justify-center mb-4">
              <Mail className="w-16 h-16 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Check Your Email</h2>
            <p className="mb-6 text-gray-600">
              We've sent password reset instructions to <strong>{email}</strong>
            </p>
            
            {/* Development Only - Show reset token */}
            {resetToken && (
              <div className="alert alert-info mb-4">
                <div className="flex-col">
                  <p className="font-semibold">Development Mode</p>
                  <p className="text-sm">Reset Token: {resetToken}</p>
                  <Link 
                    to={`/reset-password?token=${resetToken}`}
                    className="btn btn-sm btn-primary mt-2"
                  >
                    Use Reset Token
                  </Link>
                </div>
              </div>
            )}
            
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => {setSent(false); setEmail(''); setResetToken('');}}
                className="btn btn-outline"
              >
                Try Different Email
              </button>
              <Link to="/login" className="btn btn-ghost">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali ke Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-emerald-100">
      <div className="card w-96 bg-white shadow-xl">
        <div className="card-body">
          <div className="flex justify-center mb-4">
            <Mail className="w-16 h-16 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-center mb-2">Forgot Password?</h2>
          <p className="text-center text-gray-600 mb-6">
            Enter your email address and we'll send you instructions to reset your password.
          </p>
          
          <form onSubmit={submit}>
            <div className="form-control mb-6">
              <label className="label">
                <span className="label-text">Email Address</span>
              </label>
              <input
                type="email"
                className="input input-bordered"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={loading}
              />
            </div>
            
            <button className="btn btn-primary w-full mb-4" disabled={loading}>
              {loading ? (
                <>
                  <span className="loading loading-spinner"></span>
                  Sending...
                </>
              ) : (
                'Send Reset Instructions'
              )}
            </button>
          </form>
          
          <Link to="/login" className="btn btn-ghost w-full">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;