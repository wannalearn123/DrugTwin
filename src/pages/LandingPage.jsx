import React, { useState } from 'react';
import { Link } from 'react-router'; 
import { Stethoscope, Pill, User2, PillBottle, ArrowRight, LogIn } from 'lucide-react';
import LoginModal from '../components/LoginModal';

const WelcomePages = () => {
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
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("/loginPicture.jpg")'
          }}
        >
        </div>
        
      </div>

      {/* Right Side - Welcome Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-8 bg-white">
        <div className="max-w-md w-full">
          
          {/* Welcome Header */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-3">
              Welcome to <span className="text-green-600">DrugTwin</span>
            </h1>
            <p className="text-gray-600 text-lg">
              Choose how you'd like to continue
            </p>
          </div>

          {/* Role Selection Cards */}
          <div className="space-y-4 mb-8">
            {/* Pasien Card */}
            <button
              onClick={() => setActiveModal('pasien')}
              className="w-full p-6 rounded-xl border-2 border-purple-200 bg-white hover:border-purple-400 hover:bg-purple-50 transition-all duration-200 text-left group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-purple-100 text-purple-600 w-14 h-14 rounded-full flex items-center justify-center group-hover:bg-purple-200 transition duration-200">
                    <User2 size={28} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-purple-700 text-lg">Pasien</h3>
                    <p className="text-sm text-gray-600">
                      Jadwal minum obat dan monitoring kesehatan
                    </p>
                  </div>
                </div>
                <ArrowRight size={20} className="text-purple-500 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* Dokter Card */}
            <button
              onClick={() => setActiveModal('dokter')}
              className="w-full p-6 rounded-xl border-2 border-green-200 bg-white hover:border-green-400 hover:bg-green-50 transition-all duration-200 text-left group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-green-100 text-green-600 w-14 h-14 rounded-full flex items-center justify-center group-hover:bg-green-200 transition duration-200">
                    <Stethoscope size={28} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-700 text-lg">Dokter</h3>
                    <p className="text-sm text-gray-600">
                      Akses dashboard pasien dan rekomendasi terapi AI
                    </p>
                  </div>
                </div>
                <ArrowRight size={20} className="text-green-500 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* Apoteker Card */}
            <button
              onClick={() => setActiveModal('apoteker')}
              className="w-full p-6 rounded-xl border-2 border-blue-200 bg-white hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 text-left group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 text-blue-600 w-14 h-14 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition duration-200">
                    <Pill size={28} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-700 text-lg">Apoteker</h3>
                    <p className="text-sm text-gray-600">
                      Validasi resep dan cek interaksi obat
                    </p>
                  </div>
                </div>
                <ArrowRight size={20} className="text-blue-500 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white text-gray-500">Or</span>
            </div>
          </div>

          {/* Additional Options */}
          <div className="space-y-4">
            {/* Create Account Button */}
            <Link
              to="/create-account"
              className="w-full flex items-center justify-center gap-3 py-4 border-2 border-green-600 text-green-600 rounded-xl font-semibold hover:bg-green-600 hover:text-white transition-all duration-200 group"
            >
              <LogIn size={20} />
              Create New Account
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>

            {/* Continue with Google */}
            <button 
              onClick={handleGoogleSignUp}
              className="w-full flex items-center justify-center gap-3 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
          </div>

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

export default WelcomePages;