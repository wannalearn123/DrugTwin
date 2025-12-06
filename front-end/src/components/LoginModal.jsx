import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { X, Eye, EyeOff, Mail, Lock, Stethoscope, User2, Pill, Shield } from 'lucide-react';

const LoginModal = ({ 
  isOpen, 
  onClose, 
  onLogin,
  role = 'dokter'
}) => {
  const navigate = useNavigate();
  
  // Role configuration dengan warna yang DIBENARKAN
  const roleConfig = {
    dokter: { 
      title: 'Dokter', 
      icon: Stethoscope, 
      color: 'emerald', // DOKTER -> EMERALD
      description: 'Akses dashboard pasien dan rekomendasi terapi AI',
      route: '/doctor'
    },
    pasien: { 
      title: 'Pasien', 
      icon: User2, 
      color: 'emerald', // PASIEN -> EMERALD
      description: 'Jadwal minum obat dan monitoring kesehatan',
      route: '/pasien'
    },
    apoteker: { 
      title: 'Apoteker', 
      icon: Pill, 
      color: 'emerald', // APOTEKER -> EMERALD
      description: 'Validasi resep dan cek interaksi obat',
      route: '/apoteker'
    },
    administrator: {
      title: 'Administrator',
      icon: Shield,
      color: 'emerald', // ADMINISTRATOR -> EMERALD
      description: 'System management and user administration',
      route: '/admin'
    }
  };

  const config = roleConfig[role] || roleConfig['dokter'];
  const IconComponent = config.icon;

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Cek apakah form sudah lengkap
  const isFormComplete = formData.email.length > 0 && formData.password.length > 0;

  // Fungsi untuk mendapatkan class warna berdasarkan role
  const getButtonColorClass = () => {
    const colorMap = {
      emerald: {
        active: 'bg-emerald-600 hover:bg-emerald-700',
        disabled: 'bg-gray-300 text-gray-500'
      }
    };
    
    return colorMap[config.color] || colorMap.emerald;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isFormComplete) {
      alert('Harap isi semua field');
      return;
    }

    setIsLoading(true);
    
    // Simulate login process
    setTimeout(() => {
      setIsLoading(false);
      console.log(`${config.title} login:`, formData);
      
      // Panggil callback onLogin
      if (onLogin) {
        onLogin(formData);
      }
      
      // Redirect ke halaman sesuai role
      navigate(config.route);
      
      // Tutup modal
      if (onClose) {
        onClose();
      }
    }, 1500);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (!isOpen || !config) return null;

  const buttonColors = getButtonColorClass();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className={`bg-${config.color}-100 text-${config.color}-600 w-10 h-10 rounded-full flex items-center justify-center`}>
              <IconComponent size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Login sebagai {config.title}</h2>
              <p className="text-sm text-gray-600">{config.description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition duration-200"
          >
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={20} className="text-gray-400" />
                </div>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition duration-200"
                  placeholder="Masukkan email"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={20} className="text-gray-400" />
                </div>
                <input 
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition duration-200"
                  placeholder="Masukkan password"
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition duration-200"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="rememberMe"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                />
                <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-700">
                  Ingat saya
                </label>
              </div>
              <Link
                to="/forgot-password"
                onClick={onClose}
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium transition duration-200"
              >
                Lupa password?
              </Link>
            </div>

            {/* Sign In Button dengan Warna yang DIBENARKAN */}
            <button 
              type="submit"
              disabled={isLoading || !isFormComplete}
              className={`w-full py-3 rounded-lg font-semibold transition duration-200 ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed text-white'
                  : !isFormComplete
                  ? buttonColors.disabled + ' cursor-not-allowed'
                  : buttonColors.active + ' text-white transform hover:scale-[1.02]'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Masuk...
                </div>
              ) : (
                'Masuk'
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Login aman dengan enkripsi • Compliant dengan standar kesehatan
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
