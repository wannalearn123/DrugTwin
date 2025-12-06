import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 
import { Stethoscope, Pill, User2, ArrowRight, LogIn, Shield, ArrowLeft } from 'lucide-react';
import LoginModal from '../components/LoginModal';

const LoginPage = () => {
  const [activeModal, setActiveModal] = useState(null); // 'dokter', 'pasien', 'apoteker'

  const handleGoogleSignUp = () => {
    console.log('Google sign up clicked');
  };

  const handleLogin = (userData) => {
    console.log(`${activeModal} logged in:`, userData);
    // Redirect berdasarkan role
    // Contoh: navigate(`/${activeModal}/dashboard`);
  };

  return (
    <div className="min-h-screen flex">
      {/* Reusable Modal untuk semua role */}
      <LoginModal 
        isOpen={!!activeModal}
        onClose={() => setActiveModal(null)}
        onLogin={handleLogin}
        role={activeModal}
      />

      {/* Left Side - Image Section */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <div 
          className="absolute inset-0 bg-cover bg-no-repeat"
          style={{
            backgroundImage: 'url("/loginPicture.jpg")',
            backgroundPosition: '70% center'
          }}
        >
        </div>
        
      </div>

      {/* Right Side - Welcome Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-8 bg-white">
        <div className="max-w-md w-full">
          
          {/* Back Button */}
          <div className="mb-6">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium transition duration-200"
            >
              <ArrowLeft size={20} />
              Kembali
            </Link>
          </div>
          
          {/* Welcome Header */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-3">
              Welcome to <span className="text-emerald-600">DrugTwin</span>
            </h1>
            <p className="text-gray-600 text-lg">
              Choose how you'd like to continue
            </p>
          </div>

          {/* Role Selection Cards */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {/* Pasien Card */}
            <button
              onClick={() => setActiveModal('pasien')}
              className="aspect-square p-4 rounded-lg border-2 border-emerald-200 bg-white hover:border-emerald-400 hover:bg-emerald-50 transition-all duration-200 flex flex-col items-center justify-center group"
            >
              <div className="bg-emerald-100 text-emerald-600 w-12 h-12 rounded-full flex items-center justify-center group-hover:bg-emerald-200 transition duration-200 mb-3">
                <User2 size={24} />
              </div>
              <h3 className="font-semibold text-emerald-700 text-sm text-center">Pasien</h3>
            </button>

            {/* Dokter Card */}
            <button
              onClick={() => setActiveModal('dokter')}
              className="aspect-square p-4 rounded-lg border-2 border-emerald-200 bg-white hover:border-emerald-400 hover:bg-emerald-50 transition-all duration-200 flex flex-col items-center justify-center group"
            >
              <div className="bg-emerald-100 text-emerald-600 w-12 h-12 rounded-full flex items-center justify-center group-hover:bg-emerald-200 transition duration-200 mb-3">
                <Stethoscope size={24} />
              </div>
              <h3 className="font-semibold text-emerald-700 text-sm text-center">Dokter</h3>
            </button>

            {/* Apoteker Card */}
            <button
              onClick={() => setActiveModal('apoteker')}
              className="aspect-square p-4 rounded-lg border-2 border-emerald-200 bg-white hover:border-emerald-400 hover:bg-emerald-50 transition-all duration-200 flex flex-col items-center justify-center group"
            >
              <div className="bg-emerald-100 text-emerald-600 w-12 h-12 rounded-full flex items-center justify-center group-hover:bg-emerald-200 transition duration-200 mb-3">
                <Pill size={24} />
              </div>
              <h3 className="font-semibold text-emerald-700 text-sm text-center">Apoteker</h3>
            </button>
          </div>

          {/* Administrator Box */}
          <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <button
              onClick={() => setActiveModal('administrator')}
              className="w-full p-2 rounded-lg border border-emerald-300 bg-white hover:bg-emerald-50 transition-all duration-200 text-left group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-emerald-100 text-emerald-600 w-8 h-8 rounded-full flex items-center justify-center">
                    <Shield size={16} />
                  </div>
                  <div>
                    <h4 className="font-medium text-emerald-700 text-sm">Administrator</h4>
                    <p className="text-xs text-gray-600">System management access</p>
                  </div>
                </div>
                <ArrowRight size={16} className="text-emerald-500 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white text-gray-500">Or</span>
            </div>
          </div>

          {/* Additional Options */}
          <div className="grid grid-cols-2 gap-3">
            {/* Create Account Button */}
            <Link
              to="/create-account"
              className="flex items-center justify-center gap-1 py-3 border-2 border-emerald-600 text-emerald-600 rounded-lg font-semibold hover:bg-emerald-600 hover:text-white transition-all duration-200 group text-sm"
            >
              <LogIn size={16} />
              Create Account
            </Link>

            {/* Continue with Google */}
            <button 
              onClick={handleGoogleSignUp}
              className="flex items-center justify-center gap-1 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 text-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>
          </div>

          {/* Footer */}
          <footer className="mt-8 text-center text-xs text-gray-500">
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

export default LoginPage;