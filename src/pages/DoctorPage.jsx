import React, { useState } from 'react';
import AddPatientModal from '../components/AddPatientModal.jsx';
import NewPrescriptionModal from '../components/NewPrescriptionModal.jsx';
import PatientDetailCard from '../components/PatientDetailCard.jsx';
import PatientReportModal from '../components/PatientReportModal.jsx';
import PatientReferralModal from '../components/PatientReferralModal.jsx';
import {
  Search,
  Bell,
  User,
  Plus,
  Activity,
  TrendingUp,
  Calendar,
  FileText,
  Pill,
  Heart,
  AlertTriangle,
  CheckCircle,
  Clock,
  ChevronRight,
  MessageCircle,
  Download,
  Printer,
  Filter,
  Stethoscope,
  Users,
  Thermometer,
  Droplets,
  X,
  FileBarChart,
  Share2,
  BookOpen
} from 'lucide-react';

const DoctorPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [aiInsights, setAiInsights] = useState(true);
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [showNewPrescriptionModal, setShowNewPrescriptionModal] = useState(false);
  const [showPatientDetail, setShowPatientDetail] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showReferralModal, setShowReferralModal] = useState(false);

  // Data pasien
  const patients = [
    {
      id: 1,
      name: "Doni Listiono",
      patientId: "PAT001",
      age: 52,
      gender: "Male",
      diagnosis: "Diabetes Mellitus Tipe 2",
      lastVisit: "2025-11-01",
      status: "active",
      vitalSigns: {
        bloodPressure: "130/85",
        heartRate: "72",
        temperature: "36.8",
        glucose: "142",
        hba1c: "7.2%"
      },
      medications: [
        { name: "Metformin 1000mg", dosage: "2x/hari", status: "active" },
        { name: "Glimepiride 4mg", dosage: "1x/hari", status: "active" },
        { name: "Insulin Glargine", dosage: "20 units sebelum tidur", status: "active" }
      ],
      aiRecommendations: [
        "Tingkatkan dosis Metformin menjadi 1000mg 3x/hari",
        "Pertimbangkan penambahan SGLT2 inhibitor",
        "Pantau fungsi ginjal setiap 3 bulan"
      ]
    },
    {
      id: 2,
      name: "Siti Aminah",
      patientId: "PAT002",
      age: 45,
      gender: "Female",
      diagnosis: "Hipertensi Stadium 1",
      lastVisit: "2025-10-30",
      status: "active",
      vitalSigns: {
        bloodPressure: "145/92",
        heartRate: "78",
        temperature: "36.5",
        glucose: "98",
        hba1c: "5.4%"
      },
      medications: [
        { name: "Lisinopril 10mg", dosage: "1x/hari", status: "active" },
        { name: "Hydrochlorothiazide 25mg", dosage: "1x/hari", status: "active" }
      ],
      aiRecommendations: [
        "Tingkatkan dosis Lisinopril menjadi 20mg/hari",
        "Rekomendasikan diet rendah garam",
        "Pemeriksaan elektrolit rutin"
      ]
    },
    {
      id: 3,
      name: "Budi Santoso",
      patientId: "PAT003",
      age: 60,
      gender: "Male",
      diagnosis: "Tuberkulosis Paru",
      lastVisit: "2025-10-28",
      status: "active",
      vitalSigns: {
        bloodPressure: "125/80",
        heartRate: "82",
        temperature: "37.2",
        glucose: "105",
        hba1c: "5.8%"
      },
      medications: [
        { name: "Rifampicin 450mg", dosage: "1x/hari", status: "active" },
        { name: "Isoniazid 300mg", dosage: "1x/hari", status: "active" },
        { name: "Pyrazinamide 1500mg", dosage: "1x/hari", status: "active" },
        { name: "Ethambutol 800mg", dosage: "1x/hari", status: "active" }
      ],
      aiRecommendations: [
        "Pantau fungsi hati setiap bulan",
        "Pastikan kepatuhan pengobatan 6 bulan",
        "Skrining kontak serumah"
      ]
    },
    {
      id: 4,
      name: "Rina Wijaya",
      patientId: "PAT004",
      age: 38,
      gender: "Female",
      diagnosis: "Asma Bronkial",
      lastVisit: "2025-10-25",
      status: "follow-up",
      vitalSigns: {
        bloodPressure: "118/76",
        heartRate: "85",
        temperature: "36.9",
        glucose: "92",
        hba1c: "5.2%"
      },
      medications: [
        { name: "Salbutamol inhaler", dosage: "Sesuai kebutuhan", status: "active" },
        { name: "Budesonide inhaler", dosage: "2x/hari", status: "active" }
      ],
      aiRecommendations: [
        "Edukasi teknik inhalasi yang benar",
        "Pertimbangkan kontroler jangka panjang",
        "Pantau penggunaan inhaler rescue"
      ]
    }
  ];

  // Quick stats
  const stats = [
    { label: "Pasien Aktif", value: "48", change: "+2", icon: <Users size={24} />, color: "bg-blue-100 text-blue-600" },
    { label: "Kunjungan Hari Ini", value: "12", change: "+3", icon: <Calendar size={24} />, color: "bg-green-100 text-green-600" },
    { label: "Resep Tertunda", value: "3", change: "-1", icon: <FileText size={24} />, color: "bg-yellow-100 text-yellow-600" },
    { label: "Alert AI", value: "2", change: "0", icon: <AlertTriangle size={24} />, color: "bg-red-100 text-red-600" }
  ];

  const handleAddPatient = (patientData) => {
    console.log('New patient data:', patientData);
    alert('Pasien berhasil ditambahkan!');
  };

  const handleNewPrescription = (prescriptionData) => {
    console.log('New prescription:', prescriptionData);
    alert('Resep berhasil dibuat!');
  };

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
    setShowPatientDetail(true);
  };

  const handleDeselectPatient = () => {
    setSelectedPatient(null);
    setShowPatientDetail(false);
  };

  const handleFollowUp = (patientId) => {
    alert(`Follow up pasien ${patientId}`);
  };

  const handleSendMessage = (patientName) => {
    alert(`Kirim pesan ke ${patientName}`);
  };

  // Quick actions - Hanya muncul jika pasien dipilih
  const patientQuickActions = [
    {
      id: 'detail',
      label: 'Detail Pasien',
      icon: <User size={24} />,
      color: 'bg-blue-600',
      onClick: () => setShowPatientDetail(true)
    },
    {
      id: 'prescription',
      label: 'Buat Resep',
      icon: <FileText size={24} />,
      color: 'bg-green-600',
      onClick: () => setShowNewPrescriptionModal(true)
    },
    {
      id: 'report',
      label: 'Laporan',
      icon: <FileBarChart size={24} />,
      color: 'bg-purple-600',
      onClick: () => setShowReportModal(true)
    },
    {
      id: 'referral',
      label: 'Rujukan',
      icon: <Share2 size={24} />,
      color: 'bg-orange-600',
      onClick: () => setShowReferralModal(true)
    }
  ];

  const messageActions = [
    {
      id: 'message',
      label: 'Pesan',
      icon: <MessageCircle size={24} />,
      color: 'bg-indigo-600',
      onClick: () => handleSendMessage(selectedPatient?.name)
    },
    {
      id: 'followup',
      label: 'Follow-up',
      icon: <Clock size={24} />,
      color: 'bg-teal-600',
      onClick: () => handleFollowUp(selectedPatient?.id)
    },
    {
      id: 'emr',
      label: 'EMR',
      icon: <BookOpen size={24} />,
      color: 'bg-gray-600',
      onClick: () => alert('Akses EMR ' + selectedPatient?.name)
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">DRUG TWIN</h1>
              <p className="text-gray-600">Dashboard Dokter</p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari pasien atau diagnosis..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
              </div>

              <button className="relative p-2 hover:bg-gray-100 rounded-lg">
                <Bell size={24} className="text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                  D
                </div>
                <span className="font-medium text-gray-700">Dr. Yanto</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <div className="flex items-baseline space-x-2">
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    <span className={`text-sm ${stat.change.startsWith('+') ? 'text-green-600' : stat.change.startsWith('-') ? 'text-red-600' : 'text-gray-500'}`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Patients List */}
          <div className="lg:col-span-2">
            {/* Patients List Header */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex space-x-2">
                {['all', 'active', 'follow-up', 'critical'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-lg font-medium transition duration-200 ${
                      activeTab === tab
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {tab === 'all' && 'Semua Pasien'}
                    {tab === 'active' && 'Aktif'}
                    {tab === 'follow-up' && 'Follow-up'}
                    {tab === 'critical' && 'Kritis'}
                  </button>
                ))}
              </div>
              
              <div className="flex space-x-2">
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Filter size={18} className="inline mr-1" />
                  Filter
                </button>
                <button
                  onClick={() => setShowAddPatientModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 flex items-center"
                >
                  <Plus size={18} className="mr-2" />
                  Pasien Baru
                </button>
              </div>
            </div>

            {/* Patients List */}
            <div className="bg-white rounded-xl shadow">
              <div className="divide-y divide-gray-200">
                {patients.map((patient) => (
                  <div 
                    key={patient.id} 
                    className={`p-4 transition duration-200 cursor-pointer ${
                      selectedPatient?.id === patient.id 
                        ? 'bg-blue-50 border-l-4 border-blue-500' 
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleSelectPatient(patient)}
                  >
                    <div className="flex items-start">
                      {/* Checkbox/Selection Indicator */}
                      <div className="mr-3 mt-1">
                        {selectedPatient?.id === patient.id ? (
                          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                            <CheckCircle size={16} className="text-white" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 border-2 border-gray-300 rounded-full"></div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <User size={20} className="text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-800">{patient.name}</h4>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <span>ID: {patient.patientId}</span>
                              <span>{patient.age} tahun</span>
                              <span>{patient.gender}</span>
                              <span className={`px-2 py-0.5 rounded-full text-xs ${
                                patient.status === 'active' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {patient.status === 'active' ? 'Aktif' : 'Follow-up'}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="ml-13">
                          <p className="text-gray-700 mb-2">
                            <span className="font-medium">Diagnosis:</span> {patient.diagnosis}
                          </p>
                          
                          {/* Vital Signs */}
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-3">
                            <div className="flex items-center text-sm">
                              <Activity size={16} className="mr-1 text-red-500" />
                              <span className="text-gray-600">TD: </span>
                              <span className="font-medium ml-1">{patient.vitalSigns.bloodPressure}</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <Heart size={16} className="mr-1 text-pink-500" />
                              <span className="text-gray-600">HR: </span>
                              <span className="font-medium ml-1">{patient.vitalSigns.heartRate}</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <Thermometer size={16} className="mr-1 text-orange-500" />
                              <span className="text-gray-600">Suhu: </span>
                              <span className="font-medium ml-1">{patient.vitalSigns.temperature}°C</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <Droplets size={16} className="mr-1 text-blue-500" />
                              <span className="text-gray-600">Glukosa: </span>
                              <span className="font-medium ml-1">{patient.vitalSigns.glucose} mg/dL</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <TrendingUp size={16} className="mr-1 text-purple-500" />
                              <span className="text-gray-600">HbA1c: </span>
                              <span className="font-medium ml-1">{patient.vitalSigns.hba1c}</span>
                            </div>
                          </div>

                          {/* Medications */}
                          <div className="mb-2">
                            <p className="text-sm font-medium text-gray-700 mb-1">Regimen Terapi:</p>
                            <div className="flex flex-wrap gap-1">
                              {patient.medications.map((med, index) => (
                                <span 
                                  key={index} 
                                  className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-50 text-blue-700"
                                >
                                  <Pill size={12} className="mr-1" />
                                  {med.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Selection Indicator */}
                      {selectedPatient?.id === patient.id && (
                        <div className="flex flex-col items-center justify-center ml-4">
                          <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
                          <span className="text-xs text-blue-600 mt-1">Terpilih</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Selection Info Footer */}
              {selectedPatient && (
                <div className="p-4 bg-blue-50 border-t border-blue-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CheckCircle size={20} className="text-blue-600 mr-2" />
                      <div>
                        <p className="font-medium text-blue-800">Pasien Terpilih: {selectedPatient.name}</p>
                        <p className="text-sm text-blue-600">ID: {selectedPatient.patientId} • {selectedPatient.diagnosis}</p>
                      </div>
                    </div>
                    <button
                      onClick={handleDeselectPatient}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Batalkan Pilihan
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Actions & Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Actions - Hanya muncul jika pasien dipilih */}
            {selectedPatient ? (
              <>
                {/* Status Pasien Card */}
                <div className="bg-white rounded-xl shadow p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Status Pasien</h3>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedPatient.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {selectedPatient.status === 'active' ? 'Aktif' : 'Follow-up'}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      {patientQuickActions.map((action) => (
                        <button
                          key={action.id}
                          onClick={action.onClick}
                          className={`${action.color} text-white p-4 rounded-xl flex flex-col items-center justify-center hover:opacity-90 transition duration-200`}
                        >
                          {action.icon}
                          <span className="mt-2 text-sm font-medium text-center">{action.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Pesan Card */}
                <div className="bg-white rounded-xl shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Pesan & Tindakan</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {messageActions.map((action) => (
                      <button
                        key={action.id}
                        onClick={action.onClick}
                        className={`${action.color} text-white p-4 rounded-xl flex flex-col items-center justify-center hover:opacity-90 transition duration-200`}
                      >
                        {action.icon}
                        <span className="mt-2 text-xs font-medium text-center">{action.label}</span>
                      </button>
                    ))}
                  </div>
                  
                  {/* Quick Stats */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="font-medium text-gray-700 mb-3">Statistik Pasien</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600">Kunjungan Terakhir</p>
                        <p className="font-semibold">{selectedPatient.lastVisit}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600">Jumlah Obat</p>
                        <p className="font-semibold">{selectedPatient.medications.length}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              /* Placeholder jika belum pilih pasien */
              <div className="bg-white rounded-xl shadow p-8 text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User size={32} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Pilih Pasien</h3>
                <p className="text-gray-500 text-sm">
                  Klik pada salah satu pasien di daftar untuk melihat aksi cepat dan informasi detail
                </p>
              </div>
            )}

            {/* AI Insights Toggle */}
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">AI Insights</h3>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={aiInsights}
                    onChange={() => setAiInsights(!aiInsights)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Rekomendasi berbasis AI untuk pengobatan yang lebih optimal
              </p>
            </div>

            {/* Today's Schedule */}
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Jadwal Hari Ini</h3>
              <div className="space-y-3">
                <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                  <Clock size={18} className="text-blue-600 mr-3" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">Konsultasi - Doni Listiono</p>
                    <p className="text-sm text-gray-600">09:00 - 09:30</p>
                  </div>
                  <ChevronRight size={18} className="text-gray-400" />
                </div>
                <div className="flex items-center p-3 bg-green-50 rounded-lg">
                  <Clock size={18} className="text-green-600 mr-3" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">Follow-up - Siti Aminah</p>
                    <p className="text-sm text-gray-600">11:00 - 11:30</p>
                  </div>
                  <ChevronRight size={18} className="text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Patient Detail Modal */}
        {showPatientDetail && selectedPatient && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <User size={24} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">Detail Pasien</h2>
                    <p className="text-sm text-gray-600">{selectedPatient.name} - {selectedPatient.patientId}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPatientDetail(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X size={24} className="text-gray-500" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto max-h-[70vh]">
                <PatientDetailCard
                  patient={selectedPatient}
                  compact={false}
                  onFollowUp={() => handleFollowUp(selectedPatient.id)}
                  onMessage={() => handleSendMessage(selectedPatient.name)}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-8 py-4">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          <p>© 2025 Drug Twin • AI-Powered Clinical Decision Support System</p>
          <div className="mt-2">
            <span className="px-2">Diabetes Mellitus</span>
            <span className="px-2">•</span>
            <span className="px-2">Tuberkulosis</span>
            <span className="px-2">•</span>
            <span className="px-2">Hipertensi</span>
          </div>
        </div>
      </footer>

      {/* Modals */}

      <AddPatientModal
        isOpen={showAddPatientModal}
        onClose={() => setShowAddPatientModal(false)}
        onSubmit={handleAddPatient}
      />
      
      <NewPrescriptionModal
        isOpen={showNewPrescriptionModal}
        onClose={() => setShowNewPrescriptionModal(false)}
        onSubmit={handleNewPrescription}
        patientData={selectedPatient}
      />

      <PatientReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        patient={selectedPatient}
      />

      {/* Tambahkan PatientReferralModal */}
      <PatientReferralModal
        isOpen={showReferralModal}
        onClose={() => setShowReferralModal(false)}
        patient={selectedPatient}
      />
    </div>
  );
};

export default DoctorPage;