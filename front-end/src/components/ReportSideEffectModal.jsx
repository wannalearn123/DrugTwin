import React, { useState } from 'react';
import {
  X,
  AlertTriangle,
  Send,
  User,
  Stethoscope,
  FileText,
  Calendar,
  Clock
} from 'lucide-react';

const ReportSideEffectModal = ({ 
  isOpen, 
  onClose, 
  onSubmit 
}) => {
  const [formData, setFormData] = useState({
    doctorId: '',
    medication: '',
    sideEffect: '',
    severity: 'mild',
    startDate: '',
    description: '',
    additionalInfo: ''
  });

  // Mock data for doctors
  const doctors = [
    { id: 1, name: 'Dr. Ahmad Susanto', specialty: 'Dokter Umum' },
    { id: 2, name: 'Dr. Sari Indrawati', specialty: 'Spesialis Dalam' },
    { id: 3, name: 'Dr. Maya Sari', specialty: 'Spesialis Jantung' },
    { id: 4, name: 'Dr. Eko Prasetyo', specialty: 'Dokter Umum' },
  ];

  const currentMedications = [
    'Paracetamol - 10mg',
    'Amoxicillin - 500mg', 
    'Ibuprofen - 200mg'
  ];

  const severityLevels = [
    { value: 'mild', label: 'Ringan', color: 'text-yellow-600 bg-yellow-100' },
    { value: 'moderate', label: 'Sedang', color: 'text-orange-600 bg-orange-100' },
    { value: 'severe', label: 'Berat', color: 'text-red-600 bg-red-100' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
    setFormData({
      doctorId: '',
      medication: '',
      sideEffect: '',
      severity: 'mild',
      startDate: '',
      description: '',
      additionalInfo: ''
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle size={20} className="text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Laporkan Efek Samping</h2>
              <p className="text-sm text-gray-500">Laporkan efek samping obat yang Anda alami</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Doctor Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Stethoscope size={16} className="inline mr-2" />
              Pilih Dokter untuk Dilaporkan
            </label>
            <select
              value={formData.doctorId}
              onChange={(e) => setFormData({...formData, doctorId: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-red-500 focus:border-red-500"
              required
            >
              <option value="">Pilih dokter...</option>
              {doctors.map(doctor => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.name} - {doctor.specialty}
                </option>
              ))}
            </select>
          </div>

          {/* Medication */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Obat yang Menyebabkan Efek Samping
            </label>
            <select
              value={formData.medication}
              onChange={(e) => setFormData({...formData, medication: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              required
            >
              <option value="">Pilih obat...</option>
              {currentMedications.map((med, index) => (
                <option key={index} value={med}>{med}</option>
              ))}
              <option value="other">Obat Lainnya</option>
            </select>
          </div>

          {/* Side Effect Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Jenis Efek Samping
            </label>
            <input
              type="text"
              value={formData.sideEffect}
              onChange={(e) => setFormData({...formData, sideEffect: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Contoh: Mual, pusing, ruam kulit, dll."
              required
            />
          </div>

          {/* Severity and Start Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tingkat Keparahan
              </label>
              <select
                value={formData.severity}
                onChange={(e) => setFormData({...formData, severity: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                {severityLevels.map(level => (
                  <option key={level.value} value={level.value}>{level.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar size={16} className="inline mr-2" />
                Mulai Terasa
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                max={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText size={16} className="inline mr-2" />
              Deskripsi Detail Efek Samping
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              rows="4"
              placeholder="Jelaskan secara detail efek samping yang Anda alami, intensitas, frekuensi, dan dampaknya terhadap aktivitas sehari-hari..."
              required
            />
          </div>

          {/* Additional Information */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Informasi Tambahan
            </label>
            <textarea
              value={formData.additionalInfo}
              onChange={(e) => setFormData({...formData, additionalInfo: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              rows="2"
              placeholder="Tindakan yang sudah dilakukan, obat yang dihentikan, dll. (opsional)"
            />
          </div>

          {/* Severity Display */}
          {formData.severity && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-600">Tingkat Keparahan:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  severityLevels.find(level => level.value === formData.severity)?.color
                }`}>
                  {severityLevels.find(level => level.value === formData.severity)?.label}
                </span>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Send size={16} />
              <span>Kirim Laporan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportSideEffectModal;
