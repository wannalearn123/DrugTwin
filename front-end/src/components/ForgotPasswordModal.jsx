import { useState } from 'react';
import { authAPI } from '../api/authAPI';
import { Mail, X, ArrowLeft, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [resetData, setResetData] = useState(null);

  const reset = () => {
    setEmail('');
    setSent(false);
    setResetData(null);
    setLoading(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await authAPI.forgotPassword(email);
      console.log('Forgot password result:', result);
      
      if (result.status === 'success') {
        setSent(true);
        setResetData(result);
        toast.success('Password reset instructions sent to your email');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      toast.error(error.response?.data?.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  const openResetPage = () => {
    if (resetData?.resetToken) {
      window.open(`/reset-password?token=${resetData.resetToken}`, '_blank');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box relative">
        <button
          className="btn btn-sm btn-circle absolute right-2 top-2"
          onClick={handleClose}
        >
          <X className="w-4 h-4" />
        </button>

        {!sent ? (
          <>
            <div className="flex justify-center mb-4">
              <Mail className="w-12 h-12 text-primary" />
            </div>
            <h3 className="font-bold text-lg text-center mb-2">Forgot Password?</h3>
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
              
              <div className="modal-action">
                <button type="button" className="btn btn-ghost" onClick={handleClose}>
                  Cancel
                </button>
                <button className="btn btn-primary" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Sending...
                    </>
                  ) : (
                    'Send Reset Instructions'
                  )}
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-success rounded-full flex items-center justify-center">
                <Mail className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="font-bold text-lg text-center mb-2">Check Your Email</h3>
            <p className="text-center text-gray-600 mb-6">
              We've sent password reset instructions to <strong>{email}</strong>
            </p>
            
            {/* Development Only - Show reset option */}
            {resetData?.resetToken && (
              <div className="alert alert-info mb-4">
                <div className="flex-col w-full">
                  <p className="font-semibold text-sm">Development Mode</p>
                  <p className="text-xs mb-2">Reset token available for testing</p>
                  <button 
                    onClick={openResetPage}
                    className="btn btn-sm btn-primary w-full"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open Reset Page
                  </button>
                </div>
              </div>
            )}
            
            <div className="modal-action">
              <button 
                onClick={() => {setSent(false); setEmail(''); setResetData(null);}}
                className="btn btn-ghost"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Try Different Email
              </button>
              <button onClick={handleClose} className="btn btn-primary">
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordModal;