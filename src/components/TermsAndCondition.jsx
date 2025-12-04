import React from 'react';
import { X } from 'lucide-react';

const TermsModal = ({ isOpen, onClose, onAccept }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">TERMS OF SERVICE</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition duration-200"
          >
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6 text-gray-700">
            <p className="leading-relaxed">
              The following is a legal agreement between you ("you" or "User/s") 
              and the owners and operators ("we", "us", or "<span className="font-semibold text-green-600">Drug Twin</span>") 
              of the site at DrugTwin.com (the "Website") and all related websites.
            </p>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">ACCEPTING THE TERMS</h3>
              <p className="leading-relaxed">
                The following is a legal agreement between you ("you" or "User/s") 
                and the owners and operators ("we", "us", or "<span className="font-semibold text-green-600">Drug Twin</span>") 
                of the site at DrugTwin.com (the "Website") and all related websites, 
                software, mobile apps, plug-ins and other services that we provide 
                (together, the "Service").
              </p>
            </div>

            {/* Additional Terms Sections */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">USE OF SERVICE</h3>
              <p className="leading-relaxed">
                By using our Service, you agree to comply with all applicable laws 
                and regulations. You are responsible for maintaining the confidentiality 
                of your account and password.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">PRIVACY POLICY</h3>
              <p className="leading-relaxed">
                Your privacy is important to us. Our Privacy Policy explains how we 
                collect, use, and protect your personal information. By using our Service, 
                you agree to the terms of our Privacy Policy.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">MEDICAL DISCLAIMER</h3>
              <p className="leading-relaxed">
                The information provided by Drug Twin is for educational and decision 
                support purposes only and is not a substitute for professional medical 
                advice, diagnosis, or treatment. Always seek the advice of your physician 
                or other qualified health provider with any questions you may have 
                regarding a medical condition.
              </p>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <p className="text-yellow-700 text-sm">
                <strong>Important:</strong> By clicking "ACCEPT", you acknowledge that 
                you have read, understood, and agree to be bound by these Terms of Service.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end space-x-4 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition duration-200"
          >
            DECLINE
          </button>
          <button
            onClick={onAccept}
            className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition duration-200"
          >
            ACCEPT
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;