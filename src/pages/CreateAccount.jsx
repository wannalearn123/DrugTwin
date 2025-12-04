import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Tambahkan useNavigate
import { ArrowLeft, AlertCircle, Eye, EyeOff } from 'lucide-react';
import TermsModal from '../components/TermsAndCondition';

const CreateAccount = () => {
  const navigate = useNavigate(); // Tambahkan hook navigate
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    agreeToTerms: false
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Fungsi untuk kembali ke halaman utama
  const handleBackToLanding = () => {
    navigate('/'); // Arahkan ke LandingPage.jsx
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleTermsLinkClick = (e) => {
    e.preventDefault();
    setShowTermsModal(true);
  };

  const handleAcceptTerms = () => {
    setFormData(prev => ({
      ...prev,
      agreeToTerms: true
    }));
    setShowTermsModal(false);
  };

  const handleCloseTerms = () => {
    setShowTermsModal(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])/.test(formData.password)) {
      newErrors.password = 'Password must contain both uppercase and lowercase letters';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the Terms & Conditions';
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Form submitted successfully:', formData);
      setIsSubmitting(false);
      alert('Account created successfully! Please check your email for verification.');
    }, 1500);
  };

  const handleGoogleSignUp = () => {
    // Google OAuth implementation would go here
    console.log('Google sign up clicked');
  };

  const isFormValid = formData.agreeToTerms;

  return (
    <div className="min-h-screen flex">
      {/* Terms Modal */}
      <TermsModal 
        isOpen={showTermsModal}
        onClose={handleCloseTerms}
        onAccept={handleAcceptTerms}
      />

      {/* Left Side - Image Section */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("/loginPicture.jpg")'
          }}
        > </div>
      </div>

      {/* Right Side - Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-8">
        <div className="max-w-md w-full">

          {/* Tombol Back */}
          <button 
            onClick={handleBackToLanding}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition duration-200"
          >
            <ArrowLeft size={20} />
            <span>Back to Home</span>
          </button>

          {/* Form Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Create an account
            </h1>
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="text-green-600 font-semibold hover:text-green-700 transition duration-200"
              >
                Login here
              </Link>
            </p>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <input 
                  type="text" 
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200 ${
                    errors.firstName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="John"
                />
                {errors.firstName && (
                  <div className="flex items-center mt-2 text-red-600 text-sm">
                    <AlertCircle size={14} className="mr-1" />
                    {errors.firstName}
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <input 
                  type="text" 
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200 ${
                    errors.lastName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Doe"
                />
                {errors.lastName && (
                  <div className="flex items-center mt-2 text-red-600 text-sm">
                    <AlertCircle size={14} className="mr-1" />
                    {errors.lastName}
                  </div>
                )}
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200 ${
                  errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="john.doe@example.com"
              />
              {errors.email && (
                <div className="flex items-center mt-2 text-red-600 text-sm">
                  <AlertCircle size={14} className="mr-1" />
                  {errors.email}
                </div>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password *
              </label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200 pr-12 ${
                    errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition duration-200"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <div className="flex items-center mt-2 text-red-600 text-sm">
                  <AlertCircle size={14} className="mr-1" />
                  {errors.password}
                </div>
              )}
              <p className="mt-2 text-xs text-gray-500">
                Password must be at least 6 characters with uppercase & lowercase letters
              </p>
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-start space-x-3 bg-gray-50 p-4 rounded-lg">
              <input 
                type="checkbox" 
                id="terms"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                className={`w-5 h-5 mt-0.5 text-green-600 border rounded focus:ring-green-500 focus:ring-2 ${
                  errors.agreeToTerms ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              <label htmlFor="terms" className="text-sm text-gray-700 flex-1">
                I agree to the{' '}
                <button
                  type="button"
                  onClick={handleTermsLinkClick}
                  className="text-green-600 font-semibold hover:text-green-700 underline transition duration-200"
                >
                  Terms & Conditions
                </button>
                {' '}and acknowledge the Privacy Policy
              </label>
            </div>
            {errors.agreeToTerms && (
              <div className="flex items-center text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                <AlertCircle size={16} className="mr-2" />
                {errors.agreeToTerms}
              </div>
            )}

            {/* Create Account Button */}
            <button 
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className={`w-full py-4 rounded-lg font-semibold transition duration-300 shadow-sm ${
                isFormValid && !isSubmitting
                  ? 'bg-green-600 text-white hover:bg-green-700 transform hover:scale-[1.02]'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating Account...
                </div>
              ) : (
                'Create Account'
              )}
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-gray-500">Or register with</span>
              </div>
            </div>

            {/* Google Sign Up */}
            <button 
              type="button"
              onClick={handleGoogleSignUp}
              className="w-full flex items-center justify-center gap-3 py-3.5 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition duration-300 shadow-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
          </form>

          {/* Footer */}
          <footer className="mt-12 text-center text-xs text-gray-500">
            <div className="mb-2">
              <span className="px-2">Diabetes Mellitus</span>
              <span className="px-2">•</span>
              <span className="px-2">Tuberkulosis</span>
              <span className="px-2">•</span>
              <span className="px-2">Hipertensi</span>
            </div>
            © 2025 Drug Twin • AI-Powered Clinical Decision Support System
          </footer>
        </div>
      </div>
    </div>
  );
};

export default CreateAccount;