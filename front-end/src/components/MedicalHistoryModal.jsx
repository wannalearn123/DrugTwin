import React, { useState } from 'react';
import {
  X,
  FileText,
  Calendar,
  Activity,
  Heart,
  Pill,
  AlertTriangle,
  Clock,
  Stethoscope,
  Droplets,
  Thermometer,
  ChevronRight,
  Download,
  Eye
} from 'lucide-react';

const MedicalHistoryModal = ({ 
  isOpen, 
  onClose 
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock medical history data
  const medicalHistory = {
    overview: {
      totalVisits: 24,
      activeMedications: 3,
      lastVisit: '2024-11-28',
      nextAppointment: '2024-12-15'
    },
    visits: [
      {
        id: 1,
        date: '2024-11-28',
        doctor: 'Dr. Ahmad Susanto',
        specialty: 'Dokter Umum',
        diagnosis: 'Hipertensi Grade 1',
        complaint: 'Sakit kepala, pusing',
        treatment: 'Amlodipine 5mg 1x sehari',
        status: 'completed'
      },
      {
        id: 2,
        date: '2024-11-15',
        doctor: 'Dr. Sari Indrawati',
        specialty: 'Spesialis Dalam',
        diagnosis: 'Diabetes Mellitus Type 2',
        complaint: 'Sering haus, sering buang air kecil',
        treatment: 'Metformin 500mg 2x sehari',
        status: 'completed'
      },
      {
        id: 3,
        date: '2024-10-30',
        doctor: 'Dr. Ahmad Susanto',
        specialty: 'Dokter Umum',
        diagnosis: 'Gastritis Kronik',
        complaint: 'Nyeri perut, mual setelah makan',
        treatment: 'Omeprazole 20mg 1x sehari',
        status: 'completed'
      }
    ],
    medications: [
      {
        id: 1,
        name: 'Amlodipine 5mg',
        dosage: '1 tablet',
        frequency: '1x sehari',
        startDate: '2024-11-28',
        endDate: null,
        status: 'active',
        doctor: 'Dr. Ahmad Susanto'
      },
      {
        id: 2,
        name: 'Metformin 500mg',
        dosage: '1 tablet',
        frequency: '2x sehari',
        startDate: '2024-11-15',
        endDate: null,
        status: 'active',
        doctor: 'Dr. Sari Indrawati'
      },
      {
        id: 3,
        name: 'Omeprazole 20mg',
        dosage: '1 capsul',
        frequency: '1x sehari',
        startDate: '2024-10-30',
        endDate: '2024-11-30',
        status: 'completed',
        doctor: 'Dr. Ahmad Susanto'
      }
    ],
    labResults: [
      {
        id: 1,
        date: '2024-11-28',
        type: 'Pemeriksaan Darah Lengkap',
        results: [
          { parameter: 'Hemoglobin', value: '13.5', unit: 'g/dL', normal: '12.0-15.5', status: 'normal' },
          { parameter: 'Leukosit', value: '8.200', unit: '/μL', normal: '4.500-11.000', status: 'normal' },
          { parameter: 'Trombosit', value: '280.000', unit: '/μL', normal: '150.000-450.000', status: 'normal' }
        ]
      },
      {
        id: 2,
        date: '2024-11-15',
        type: 'Gula Darah',
        results: [
          { parameter: 'GDP', value: '125', unit: 'mg/dL', normal: '<100', status: 'high' },
          { parameter: 'GD2PP', value: '180', unit: 'mg/dL', normal: '<140', status: 'high' },
          { parameter: 'HbA1c', value: '7.2', unit: '%', normal: '<6.5', status: 'high' }
        ]
      }
    ]
  };

  const tabs = [
    { id: 'overview', label: 'Ringkasan', icon: Activity },
    { id: 'visits', label: 'Riwayat Kunjungan', icon: Calendar },
    { id: 'medications', label: 'Riwayat Obat', icon: Pill },
    { id: 'lab', label: 'Hasil Lab', icon: FileText }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <FileText size={20} className="text-emerald-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Riwayat Kesehatan</h2>
              <p className="text-sm text-gray-500">Riwayat lengkap kesehatan Anda</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 px-6">
          <div className="flex space-x-8">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-emerald-500 text-emerald-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-emerald-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-emerald-600">{medicalHistory.overview.totalVisits}</div>
                  <div className="text-sm text-gray-600">Total Kunjungan</div>
                </div>
                <div className="bg-emerald-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-emerald-600">{medicalHistory.overview.activeMedications}</div>
                  <div className="text-sm text-gray-600">Obat Aktif</div>
                </div>
                <div className="bg-emerald-50 rounded-lg p-4 text-center">
                  <div className="text-sm font-bold text-emerald-600">{medicalHistory.overview.lastVisit}</div>
                  <div className="text-sm text-gray-600">Kunjungan Terakhir</div>
                </div>
                <div className="bg-emerald-50 rounded-lg p-4 text-center">
                  <div className="text-sm font-bold text-emerald-600">{medicalHistory.overview.nextAppointment}</div>
                  <div className="text-sm text-gray-600">Janji Berikutnya</div>
                </div>
              </div>

              {/* Recent Activity */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Aktivitas Terbaru</h3>
                <div className="space-y-3">
                  {medicalHistory.visits.slice(0, 3).map(visit => (
                    <div key={visit.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-medium text-gray-800">{visit.diagnosis}</div>
                          <div className="text-sm text-gray-500">{visit.date} • {visit.doctor}</div>
                          <div className="text-sm text-gray-600 mt-1">{visit.complaint}</div>
                        </div>
                        <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-full">
                          Selesai
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'visits' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Riwayat Kunjungan</h3>
                <button className="flex items-center space-x-2 text-emerald-600 hover:text-emerald-700">
                  <Download size={16} />
                  <span className="text-sm">Export PDF</span>
                </button>
              </div>
              
              {medicalHistory.visits.map(visit => (
                <div key={visit.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Calendar size={16} className="text-gray-400" />
                        <span className="font-medium text-gray-800">{visit.date}</span>
                        <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-full">
                          Selesai
                        </span>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-500 mb-1">Dokter & Spesialisasi</div>
                          <div className="font-medium">{visit.doctor}</div>
                          <div className="text-sm text-gray-600">{visit.specialty}</div>
                        </div>
                        
                        <div>
                          <div className="text-sm text-gray-500 mb-1">Diagnosis</div>
                          <div className="font-medium text-emerald-600">{visit.diagnosis}</div>
                        </div>
                        
                        <div>
                          <div className="text-sm text-gray-500 mb-1">Keluhan</div>
                          <div className="text-sm">{visit.complaint}</div>
                        </div>
                        
                        <div>
                          <div className="text-sm text-gray-500 mb-1">Pengobatan</div>
                          <div className="text-sm">{visit.treatment}</div>
                        </div>
                      </div>
                    </div>
                    
                    <button className="ml-4 p-2 text-gray-400 hover:text-gray-600">
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'medications' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Riwayat Pengobatan</h3>
              
              {medicalHistory.medications.map(med => (
                <div key={med.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <Pill size={16} className="text-emerald-600" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="font-medium text-gray-800">{med.name}</div>
                        <div className="text-sm text-gray-600">{med.dosage} • {med.frequency}</div>
                        <div className="text-sm text-gray-500 mt-1">
                          Mulai: {med.startDate} {med.endDate && `• Selesai: ${med.endDate}`}
                        </div>
                        <div className="text-sm text-gray-500">Diresepkan oleh: {med.doctor}</div>
                      </div>
                    </div>
                    
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      med.status === 'active' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {med.status === 'active' ? 'Aktif' : 'Selesai'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'lab' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Hasil Laboratorium</h3>
              
              {medicalHistory.labResults.map(lab => (
                <div key={lab.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="font-medium text-gray-800">{lab.type}</div>
                      <div className="text-sm text-gray-500">{lab.date}</div>
                    </div>
                    <button className="flex items-center space-x-2 text-emerald-600 hover:text-emerald-700">
                      <Eye size={16} />
                      <span className="text-sm">Lihat Detail</span>
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    {lab.results.map((result, index) => (
                      <div key={index} className="grid grid-cols-4 gap-4 py-2 border-b border-gray-100 last:border-b-0">
                        <div className="font-medium text-sm">{result.parameter}</div>
                        <div className="text-sm">{result.value} {result.unit}</div>
                        <div className="text-sm text-gray-500">{result.normal}</div>
                        <div>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            result.status === 'normal' 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : result.status === 'high'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {result.status === 'normal' ? 'Normal' : 
                             result.status === 'high' ? 'Tinggi' : 'Rendah'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicalHistoryModal;
