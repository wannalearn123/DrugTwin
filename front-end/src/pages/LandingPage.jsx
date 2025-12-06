import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center relative">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("/loginPicture.jpg")'
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-6">
        <div className="mb-8">
          <h1 className="text-6xl font-bold mb-4">
            <span className="text-emerald-400">Drug</span>Twin
          </h1>
          <p className="text-xl text-gray-200 mb-2">
            AI-Powered Clinical Decision Support System
          </p>
          <p className="text-lg text-gray-300">
            Diabetes Mellitus • Tuberkulosis • Hipertensi
          </p>
        </div>

        <Link
          to="/login"
          className="inline-flex items-center gap-3 px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all duration-200 group text-lg"
        >
          Tap untuk melanjutkan
          <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
        </Link>

      </div>
    </div>
  );
};

export default LandingPage;