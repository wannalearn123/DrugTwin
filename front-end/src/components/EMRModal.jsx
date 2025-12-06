import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  Calendar, 
  User, 
  Pill, 
  Activity, 
  Heart, 
  Thermometer, 
  Droplets, 
  TrendingUp,
  Download,
  Printer,
  Edit,
  Plus,
  Clock,
  AlertTriangle,
  CheckCircle,
  Eye
} from 'lucide-react';

const EMRModal = ({ isOpen, onClose, patient }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!isOpen || !patient) return null;

  // Sample EMR data
  const medicalHistory = [
    {
      date: '2025-12-01',
      type: 'Kunjungan Rutin',
      doctor: 'Dr. Yanto',
      diagnosis: 'Diabetes Mellitus Tipe 2 - Kontrol Rutin',
      symptoms: 'Tidak ada keluhan khusus, kadar gula stabil',
      treatment: 'Lanjutkan terapi Metformin, kontrol diet',
      notes: 'Pasien menunjukkan perbaikan kadar HbA1c'
    },
    {
      date: '2025-11-15',
      type: 'Konsultasi',
      doctor: 'Dr. Yanto',
      diagnosis: 'Hipertensi Grade 1',
      symptoms: 'Pusing ringan, tekanan darah 145/95',
      treatment: 'Mulai ACE inhibitor, monitoring TD',
      notes: 'Pasien disarankan mengurangi konsumsi garam'
    },
    {
      date: '2025-10-28',
      type: 'Lab Results',
      doctor: 'Dr. Yanto',
      diagnosis: 'Follow-up Lab Diabetes',
      symptoms: '-',
      treatment: 'Evaluasi hasil lab',
      notes: 'HbA1c: 7.2%, Glukosa puasa: 142 mg/dL'
    }
  ];

  const prescriptions = [
    {
      date: '2025-12-01',
      medication: 'Metformin 1000mg',
      dosage: '2x sehari setelah makan',
      quantity: '60 tablet',
      duration: '30 hari',
      status: 'Aktif'
    },
    {
      date: '2025-12-01',
      medication: 'Lisinopril 10mg',
      dosage: '1x sehari pagi hari',
      quantity: '30 tablet',
      duration: '30 hari',
      status: 'Aktif'
    },
    {
      date: '2025-11-15',
      medication: 'Glimepiride 4mg',
      dosage: '1x sehari sebelum makan',
      quantity: '30 tablet',
      duration: '30 hari',
      status: 'Selesai'
    }
  ];

  const labResults = [
    {
      date: '2025-12-01',
      test: 'Glukosa Puasa',
      result: '142 mg/dL',
      reference: '70-100 mg/dL',
      status: 'Tinggi'
    },
    {
      date: '2025-12-01',
      test: 'HbA1c',
      result: '7.2%',
      reference: '< 7.0%',
      status: 'Tinggi'
    },
    {
      date: '2025-12-01',
      test: 'Kolesterol Total',
      result: '185 mg/dL',
      reference: '< 200 mg/dL',
      status: 'Normal'
    },
    {
      date: '2025-12-01',
      test: 'Kreatinin',
      result: '0.9 mg/dL',
      reference: '0.6-1.2 mg/dL',
      status: 'Normal'
    }
  ];

  const vitalHistory = [
    { date: '2025-12-01', bp: '130/85', hr: '72', temp: '36.8', weight: '68 kg' },
    { date: '2025-11-15', bp: '145/95', hr: '78', temp: '36.5', weight: '69 kg' },
    { date: '2025-10-28', bp: '140/90', hr: '75', temp: '36.9', weight: '70 kg' },
    { date: '2025-10-01', bp: '135/88', hr: '73', temp: '36.7', weight: '71 kg' }
  ];

  const tabs = [
    { id: 'overview', label: 'Ringkasan', icon: <Eye size={18} /> },
    { id: 'history', label: 'Riwayat Medis', icon: <FileText size={18} /> },
    { id: 'prescriptions', label: 'Resep', icon: <Pill size={18} /> },
    { id: 'labs', label: 'Lab Results', icon: <Activity size={18} /> },
    { id: 'vitals', label: 'Vital Signs', icon: <Heart size={18} /> }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
              <FileText size={24} className="text-emerald-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Electronic Medical Record</h2>
              <p className="text-sm text-gray-600">{patient.name} - {patient.patientId}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
              <Download size={20} />
            </button>
            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
              <Printer size={20} />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 px-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Patient Info Summary */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  {/* Current Status */}
                  <div className="bg-emerald-50 rounded-lg p-4">
                    <h3 className="font-semibold text-emerald-800 mb-3">Status Terkini</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-emerald-600">Diagnosis Utama</p>
                        <p className="font-medium text-emerald-900">{patient.diagnosis}</p>
                      </div>
                      <div>
                        <p className="text-sm text-emerald-600">Status Pasien</p>
                        <span className="inline-block px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-medium">
                          {patient.status === 'active' ? 'Aktif' : 'Follow-up'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Latest Vitals */}
                  <div className="patient-card">
                    <h3 className="font-semibold text-gray-800 mb-3">Vital Signs Terbaru</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <Activity size={20} className="mx-auto text-emerald-500 mb-1" />
                        <p className="text-xs text-gray-600">Tekanan Darah</p>
                        <p className="font-semibold">{patient.vitalSigns.bloodPressure}</p>
                      </div>
                      <div className="text-center">
                        <Heart size={20} className="mx-auto text-emerald-500 mb-1" />
                        <p className="text-xs text-gray-600">Heart Rate</p>
                        <p className="font-semibold">{patient.vitalSigns.heartRate} bpm</p>
                      </div>
                      <div className="text-center">
                        <Thermometer size={20} className="mx-auto text-emerald-500 mb-1" />
                        <p className="text-xs text-gray-600">Suhu</p>
                        <p className="font-semibold">{patient.vitalSigns.temperature}°C</p>
                      </div>
                      <div className="text-center">
                        <Droplets size={20} className="mx-auto text-emerald-500 mb-1" />
                        <p className="text-xs text-gray-600">Glukosa</p>
                        <p className="font-semibold">{patient.vitalSigns.glucose} mg/dL</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Info */}
                <div className="space-y-4">
                  <div className="patient-card">
                    <h3 className="font-semibold text-gray-800 mb-3">Info Pasien</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-600">Umur</p>
                        <p className="font-medium">{patient.age} tahun</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Jenis Kelamin</p>
                        <p className="font-medium">{patient.gender === 'Male' ? 'Laki-laki' : 'Perempuan'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Kunjungan Terakhir</p>
                        <p className="font-medium">{patient.lastVisit}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Medical History Tab */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">Riwayat Kunjungan Medis</h3>
                <button className="flex items-center space-x-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600">
                  <Plus size={16} />
                  <span>Tambah Record</span>
                </button>
              </div>
              
              <div className="space-y-4">
                {medicalHistory.map((record, index) => (
                  <div key={index} className="patient-card">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-semibold text-gray-800">{record.type}</h4>
                          <span className="text-xs text-gray-500">{record.date}</span>
                        </div>
                        <p className="text-sm text-emerald-600">{record.doctor}</p>
                      </div>
                      <button className="p-1 text-gray-400 hover:text-gray-600">
                        <Edit size={16} />
                      </button>
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs font-medium text-gray-600">Diagnosis:</p>
                        <p className="text-sm">{record.diagnosis}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-600">Keluhan:</p>
                        <p className="text-sm">{record.symptoms}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-600">Tindakan:</p>
                        <p className="text-sm">{record.treatment}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-600">Catatan:</p>
                        <p className="text-sm">{record.notes}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Prescriptions Tab */}
          {activeTab === 'prescriptions' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">Riwayat Resep Obat</h3>
                <button className="flex items-center space-x-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600">
                  <Plus size={16} />
                  <span>Resep Baru</span>
                </button>
              </div>
              
              <div className="patient-card overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">Tanggal</th>
                      <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">Obat</th>
                      <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">Dosis</th>
                      <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">Durasi</th>
                      <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prescriptions.map((prescription, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-3 px-2 text-sm">{prescription.date}</td>
                        <td className="py-3 px-2 text-sm font-medium">{prescription.medication}</td>
                        <td className="py-3 px-2 text-sm">{prescription.dosage}</td>
                        <td className="py-3 px-2 text-sm">{prescription.duration}</td>
                        <td className="py-3 px-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            prescription.status === 'Aktif' 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {prescription.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Lab Results Tab */}
          {activeTab === 'labs' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">Hasil Laboratorium</h3>
                <button className="flex items-center space-x-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600">
                  <Plus size={16} />
                  <span>Input Hasil Lab</span>
                </button>
              </div>
              
              <div className="patient-card">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">Test</th>
                      <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">Hasil</th>
                      <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">Nilai Normal</th>
                      <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">Status</th>
                      <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">Tanggal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {labResults.map((result, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-3 px-2 text-sm font-medium">{result.test}</td>
                        <td className="py-3 px-2 text-sm font-semibold">{result.result}</td>
                        <td className="py-3 px-2 text-sm text-gray-600">{result.reference}</td>
                        <td className="py-3 px-2">
                          <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                            result.status === 'Normal' 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : result.status === 'Tinggi'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {result.status === 'Normal' && <CheckCircle size={12} />}
                            {result.status === 'Tinggi' && <AlertTriangle size={12} />}
                            <span>{result.status}</span>
                          </span>
                        </td>
                        <td className="py-3 px-2 text-sm">{result.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Vital Signs Tab */}
          {activeTab === 'vitals' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">Riwayat Vital Signs</h3>
                <button className="flex items-center space-x-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600">
                  <Plus size={16} />
                  <span>Input Vital Signs</span>
                </button>
              </div>
              
              <div className="patient-card">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">Tanggal</th>
                      <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">Tekanan Darah</th>
                      <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">Heart Rate</th>
                      <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">Suhu</th>
                      <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">Berat Badan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vitalHistory.map((vital, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-3 px-2 text-sm">{vital.date}</td>
                        <td className="py-3 px-2 text-sm font-medium">{vital.bp}</td>
                        <td className="py-3 px-2 text-sm">{vital.hr}</td>
                        <td className="py-3 px-2 text-sm">{vital.temp}</td>
                        <td className="py-3 px-2 text-sm">{vital.weight}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EMRModal;