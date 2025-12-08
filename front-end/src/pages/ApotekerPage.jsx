import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import MessageModal from '../components/MessageModal';
import {
  Search,
  Filter,
  Clock,
  CheckCircle,
  User,
  AlertTriangle,
  MessageCircle,
  ChevronRight,
  Download,
  Printer,
  Send,
  Edit,
  Phone,
  MapPin,
  Shield,
  Eye,
  FileText,
  Package,
  Star,
  Heart,
  Calendar,
  Bell,
  Bot
} from 'lucide-react';

const ApotekerPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [activeTab, setActiveTab] = useState('waiting');
  const [selectedChatPatient, setSelectedChatPatient] = useState(null);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isExpiredModalOpen, setIsExpiredModalOpen] = useState(false);
  const [isAiInteractionModalOpen, setIsAiInteractionModalOpen] = useState(false);

  // Data pasien menunggu validasi
  const waitingPatients = [
    {
      id: 1,
      name: "Yanto",
      doctor: "Dr. Ahmad Surya",
      time: "10:30",
      priority: "high",
      prescriptions: [
        { name: "Insulin Detemir 100 U/ml", dosage: "1x/hari", note: "Monitor gula darah jika mual atau pusing" },
        { name: "Atorvastatin 20mg", dosage: "1x/hari", note: "Diminum malam hari" },
        { name: "Metformin 500mg", dosage: "3x/hari", note: "Diminum setelah makan" }
      ],
      alerts: [
        { type: "warning", message: "Perhatian: Potensi interaksi insulin dan atorvastatin" },
        { type: "success", message: "Tidak ada duplikasi obat" }
      ],
      aiRecommendation: "Berikan edukasi tentang waktu pemberian insulin dan monitoring gula darah"
    },
    {
      id: 2,
      name: "Sarah Wijaya",
      doctor: "Dr. Budi Santoso",
      time: "11:15",
      priority: "medium",
      prescriptions: [
        { name: "Paracetamol 500mg", dosage: "3x/hari", note: "Jika demam tinggi di atas 38°C" },
        { name: "Vitamin C 500mg", dosage: "2x/hari", note: "Setelah makan" }
      ],
      alerts: [
        { type: "success", message: "Tidak ada interaksi obat yang ditemukan" }
      ],
      aiRecommendation: "Resep aman, dapat langsung diberikan"
    },
    {
      id: 3,
      name: "Budi Hartono",
      doctor: "Dr. Lisa Amelia",
      time: "12:00",
      priority: "high",
      prescriptions: [
        { name: "Captopril 25mg", dosage: "2x/hari", note: "Monitor tekanan darah" },
        { name: "Furosemide 40mg", dosage: "1x/hari", note: "Pagi hari sebelum makan" }
      ],
      alerts: [
        { type: "danger", message: "Peringatan: Monitor fungsi ginjal secara berkala" }
      ],
      aiRecommendation: "Pantau elektrolit dan fungsi ginjal, berikan edukasi diet rendah garam"
    }
  ];

  // Data resep yang sudah tervalidasi
  const validatedPrescriptions = [
    {
      id: 4,
      name: "Ani Kusuma",
      doctor: "Dr. Rahman",
      time: "09:45",
      status: "ready",
      totalItems: 3,
      completedItems: 3
    },
    {
      id: 5,
      name: "Dedi Prasetyo",
      doctor: "Dr. Maya",
      time: "09:20",
      status: "partial",
      totalItems: 4,
      completedItems: 2
    }
  ];

  // Filter patients based on search
  const filteredPatients = waitingPatients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.doctor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get alert color class
  const getAlertColor = (type) => {
    switch (type) {
      case 'danger': return 'bg-red-50 border-red-200 text-red-700';
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-700';
      case 'success': return 'bg-emerald-50 border-emerald-200 text-emerald-700';
      default: return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  // Get priority badge color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Handle opening chat modal
  const handleOpenChat = (patient) => {
    setSelectedChatPatient(patient);
    setIsMessageModalOpen(true);
  };

  // Handle closing chat modal
  const handleCloseChat = () => {
    setIsMessageModalOpen(false);
    setSelectedChatPatient(null);
  };

  // Handle quick actions
  const handleStockCheck = () => {
    setIsStockModalOpen(true);
  };

  const handleDailyReport = () => {
    setIsReportModalOpen(true);
  };

  const handleExpiredMeds = () => {
    setIsExpiredModalOpen(true);
  };

  const handleAiInteraction = () => {
    setIsAiInteractionModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-emerald-50">
      <Navbar />
      
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Apoteker</h1>
          <p className="text-gray-600">Kelola validasi resep dan distribusi obat</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-emerald-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-600">Menunggu Validasi</p>
                <p className="text-2xl font-bold text-emerald-700">12</p>
              </div>
              <Clock className="h-8 w-8 text-emerald-600" />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border border-emerald-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-600">Tervalidasi Hari Ini</p>
                <p className="text-2xl font-bold text-emerald-700">48</p>
              </div>
              <CheckCircle className="h-8 w-8 text-emerald-600" />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border border-emerald-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-600">AI Deteksi Interaksi</p>
                <p className="text-2xl font-bold text-emerald-700">3</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-emerald-600" />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border border-emerald-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-600">Stok Menipis</p>
                <p className="text-2xl font-bold text-emerald-700">7</p>
              </div>
              <Package className="h-8 w-8 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Patient List */}
          <div className="lg:col-span-2">
            {/* Search and Filter */}
            <div className="bg-white rounded-lg shadow-sm border border-emerald-200 mb-4">
              <div className="p-4 border-b border-emerald-200">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Cari nama pasien atau dokter..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <button className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filter
                  </button>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="flex border-b border-emerald-200">
                <button
                  onClick={() => setActiveTab('waiting')}
                  className={`px-6 py-3 font-medium text-sm ${
                    activeTab === 'waiting'
                      ? 'border-b-2 border-emerald-500 text-emerald-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Menunggu Validasi ({filteredPatients.length})
                </button>
                <button
                  onClick={() => setActiveTab('validated')}
                  className={`px-6 py-3 font-medium text-sm ${
                    activeTab === 'validated'
                      ? 'border-b-2 border-emerald-500 text-emerald-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Tervalidasi ({validatedPrescriptions.length})
                </button>
              </div>
            </div>

            {/* Patient Cards */}
            {activeTab === 'waiting' && (
              <div className="space-y-4">
                {filteredPatients.map((patient) => (
                  <div key={patient.id} className="patient-card bg-white rounded-lg shadow-sm border border-emerald-200 hover:shadow-md transition-shadow">
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(patient.priority)}`}>
                              {patient.priority === 'high' ? 'Prioritas Tinggi' : 
                               patient.priority === 'medium' ? 'Prioritas Sedang' : 'Prioritas Rendah'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{patient.doctor}</p>
                          <p className="text-xs text-gray-500">Waktu: {patient.time}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedPatient(patient)}
                            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-md"
                            title="Lihat Detail"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleOpenChat(patient)}
                            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-md"
                            title="Chat dengan Pasien"
                          >
                            <MessageCircle className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {/* Prescription Summary */}
                      <div className="mb-3">
                        <p className="text-sm font-medium text-gray-700 mb-2">Resep ({patient.prescriptions.length} obat):</p>
                        <div className="space-y-1">
                          {patient.prescriptions.slice(0, 2).map((prescription, index) => (
                            <div key={index} className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                              <span className="font-medium">{prescription.name}</span> - {prescription.dosage}
                            </div>
                          ))}
                          {patient.prescriptions.length > 2 && (
                            <div className="text-xs text-emerald-600 font-medium">
                              +{patient.prescriptions.length - 2} obat lainnya
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Alerts */}
                      {patient.alerts.length > 0 && (
                        <div className="space-y-2 mb-3">
                          {patient.alerts.map((alert, index) => (
                            <div key={index} className={`p-2 rounded-md border text-xs ${getAlertColor(alert.type)}`}>
                              {alert.message}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* AI Recommendation */}
                      <div className="bg-emerald-100 border border-emerald-200 p-2 rounded-md mb-3">
                        <div className="flex items-start gap-2">
                          <Bot className="h-4 w-4 text-emerald-600 mt-0.5" />
                          <div>
                            <p className="text-xs font-medium text-emerald-700">Rekomendasi AI:</p>
                            <p className="text-xs text-emerald-600">{patient.aiRecommendation}</p>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button className="flex-1 px-4 py-2 bg-emerald-500 text-white text-sm font-medium rounded-md hover:bg-emerald-600">
                          Validasi Resep
                        </button>
                        <button className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200">
                          Tunda
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'validated' && (
              <div className="space-y-4">
                {validatedPrescriptions.map((prescription) => (
                  <div key={prescription.id} className="patient-card bg-white rounded-lg shadow-sm border border-emerald-200">
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">{prescription.name}</h3>
                          <p className="text-sm text-gray-600">{prescription.doctor}</p>
                          <p className="text-xs text-gray-500">Divalidasi: {prescription.time}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          prescription.status === 'ready' ? 'bg-emerald-100 text-emerald-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {prescription.status === 'ready' ? 'Siap Diambil' : 'Dalam Proses'}
                        </span>
                      </div>
                      
                      <div className="mb-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-gray-600">Progress Penyiapan:</span>
                          <span className="text-sm font-medium">{prescription.completedItems}/{prescription.totalItems}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-emerald-500 h-2 rounded-full" 
                            style={{ width: `${(prescription.completedItems / prescription.totalItems) * 100}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button className="flex-1 px-4 py-2 bg-emerald-500 text-white text-sm font-medium rounded-md hover:bg-emerald-600">
                          Serahkan Obat
                        </button>
                        <button className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200">
                          <Printer className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Quick Actions & Info */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-emerald-200">
              <div className="p-4 border-b border-emerald-200">
                <h3 className="font-semibold text-emerald-700">Aksi Cepat</h3>
              </div>
              <div className="p-4 space-y-3">
                <button 
                  onClick={handleStockCheck}
                  className="w-full flex items-center justify-between p-3 bg-emerald-100 hover:bg-emerald-200 rounded-lg text-left group"
                >
                  <div className="flex items-center gap-3">
                    <Package className="h-5 w-5 text-emerald-600" />
                    <span className="font-medium text-emerald-700">Cek Stok Obat</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-emerald-600 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button 
                  onClick={handleDailyReport}
                  className="w-full flex items-center justify-between p-3 bg-emerald-100 hover:bg-emerald-200 rounded-lg text-left group"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-emerald-600" />
                    <span className="font-medium text-emerald-700">Laporan Harian</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-emerald-600 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button 
                  onClick={handleExpiredMeds}
                  className="w-full flex items-center justify-between p-3 bg-emerald-100 hover:bg-emerald-200 rounded-lg text-left group"
                >
                  <div className="flex items-center gap-3">
                    <Bell className="h-5 w-5 text-emerald-600" />
                    <span className="font-medium text-emerald-700">Obat Kadaluarsa</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-emerald-600 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button 
                  onClick={handleAiInteraction}
                  className="w-full flex items-center justify-between p-3 bg-emerald-100 hover:bg-emerald-200 rounded-lg text-left group"
                >
                  <div className="flex items-center gap-3">
                    <Bot className="h-5 w-5 text-emerald-600" />
                    <span className="font-medium text-emerald-700">AI Drug Interaction</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-emerald-600 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Today's Summary */}
            <div className="bg-white rounded-lg shadow-sm border border-emerald-200">
              <div className="p-4 border-b border-emerald-200">
                <h3 className="font-semibold text-emerald-700">Ringkasan Hari Ini</h3>
              </div>
              <div className="p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-emerald-600">Resep Divalidasi</span>
                  <span className="font-semibold text-emerald-700">48</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-emerald-600">Obat Diserahkan</span>
                  <span className="font-semibold text-emerald-700">42</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-emerald-600">Interaksi Terdeteksi</span>
                  <span className="font-semibold text-emerald-700">3</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-emerald-600">Konsultasi Diberikan</span>
                  <span className="font-semibold text-emerald-700">15</span>
                </div>
              </div>
            </div>

            {/* Alerts */}
            <div className="bg-white rounded-lg shadow-sm border border-emerald-200">
              <div className="p-4 border-b border-emerald-200">
                <h3 className="font-semibold text-emerald-700">Peringatan Sistem</h3>
              </div>
              <div className="p-4 space-y-3">
                <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-700">Stok Insulin Menipis</p>
                      <p className="text-xs text-red-600">Sisa 5 vial, segera lakukan pemesanan</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Calendar className="h-4 w-4 text-yellow-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-yellow-700">Obat Akan Kadaluarsa</p>
                      <p className="text-xs text-yellow-600">7 item kadaluarsa dalam 30 hari</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Patient Detail Modal */}
        {selectedPatient && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">Detail Resep - {selectedPatient.name}</h2>
                  <button
                    onClick={() => setSelectedPatient(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </div>
                <p className="text-gray-600 mt-1">Dokter: {selectedPatient.doctor}</p>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Prescription Details */}
                <div>
                  <h3 className="font-semibold text-emerald-700 mb-3">Daftar Obat</h3>
                  <div className="space-y-3">
                    {selectedPatient.prescriptions.map((prescription, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-gray-900">{prescription.name}</h4>
                          <span className="text-sm text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                            {prescription.dosage}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{prescription.note}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Alerts */}
                <div>
                  <h3 className="font-semibold text-emerald-700 mb-3">Peringatan & Validasi</h3>
                  <div className="space-y-2">
                    {selectedPatient.alerts.map((alert, index) => (
                      <div key={index} className={`p-3 rounded-lg border ${getAlertColor(alert.type)}`}>
                        {alert.message}
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Recommendation */}
                <div>
                  <h3 className="font-semibold text-emerald-700 mb-3">Rekomendasi AI</h3>
                  <div className="bg-emerald-100 border border-emerald-200 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Bot className="h-5 w-5 text-emerald-600 mt-0.5" />
                      <p className="text-emerald-700">{selectedPatient.aiRecommendation}</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button className="flex-1 px-4 py-2 bg-emerald-500 text-white font-medium rounded-lg hover:bg-emerald-600">
                    Validasi & Proses Resep
                  </button>
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200">
                    Butuh Konsultasi Dokter
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Message Modal */}
        <MessageModal 
          isOpen={isMessageModalOpen}
          onClose={handleCloseChat}
          patient={selectedChatPatient}
        />

        {/* Stock Check Modal */}
        {isStockModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-emerald-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-emerald-700">Cek Stok Obat</h2>
                  <button
                    onClick={() => setIsStockModalOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-emerald-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-emerald-700 mb-2">Stok Normal</h3>
                    <p className="text-2xl font-bold text-emerald-600">156</p>
                    <p className="text-sm text-emerald-600">Item obat</p>
                  </div>
                  <div className="bg-emerald-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-emerald-700 mb-2">Stok Menipis</h3>
                    <p className="text-2xl font-bold text-emerald-600">7</p>
                    <p className="text-sm text-emerald-600">Perlu restok</p>
                  </div>
                  <div className="bg-emerald-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-emerald-700 mb-2">Stok Habis</h3>
                    <p className="text-2xl font-bold text-emerald-600">2</p>
                    <p className="text-sm text-emerald-600">Segera pesan</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-emerald-700">Obat yang Perlu Perhatian</h3>
                  
                  <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium text-gray-900">Insulin Detemir 100 U/ml</h4>
                        <p className="text-sm text-gray-600">Sisa: 5 vial | Min: 10 vial</p>
                      </div>
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">Menipis</span>
                    </div>
                  </div>

                  <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium text-gray-900">Amoxicillin 500mg</h4>
                        <p className="text-sm text-gray-600">Sisa: 0 strip | Min: 20 strip</p>
                      </div>
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">Habis</span>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium text-gray-900">Paracetamol 500mg</h4>
                        <p className="text-sm text-gray-600">Sisa: 8 strip | Min: 15 strip</p>
                      </div>
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">Menipis</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-6 border-t border-gray-200 mt-6">
                  <button className="flex-1 px-4 py-2 bg-emerald-500 text-white font-medium rounded-lg hover:bg-emerald-600">
                    Buat Pesanan Otomatis
                  </button>
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200">
                    Export Data
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Daily Report Modal */}
        {isReportModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-emerald-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-emerald-700">Laporan Harian Apotek</h2>
                  <button
                    onClick={() => setIsReportModalOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </div>
                <p className="text-gray-600 mt-1">Tanggal: {new Date().toLocaleDateString('id-ID')}</p>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-emerald-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-emerald-700 mb-2">Resep Divalidasi</h3>
                    <p className="text-2xl font-bold text-emerald-600">48</p>
                  </div>
                  <div className="bg-emerald-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-emerald-700 mb-2">Obat Diserahkan</h3>
                    <p className="text-2xl font-bold text-emerald-600">42</p>
                  </div>
                  <div className="bg-emerald-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-emerald-700 mb-2">Interaksi Terdeteksi</h3>
                    <p className="text-2xl font-bold text-emerald-600">3</p>
                  </div>
                  <div className="bg-emerald-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-emerald-700 mb-2">Konsultasi</h3>
                    <p className="text-2xl font-bold text-emerald-600">15</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-emerald-700">Aktivitas Terbaru</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm">09:30 - Validasi resep Yanto (3 obat)</span>
                      <span className="text-xs text-emerald-600 bg-emerald-100 px-2 py-1 rounded">Selesai</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm">10:15 - Konsultasi Sarah Wijaya (efek samping)</span>
                      <span className="text-xs text-emerald-600 bg-emerald-100 px-2 py-1 rounded">Konsultasi</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm">11:00 - Deteksi interaksi Budi Hartono</span>
                      <span className="text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded">Perhatian</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button className="flex-1 px-4 py-2 bg-emerald-500 text-white font-medium rounded-lg hover:bg-emerald-600">
                    <Download className="h-4 w-4 inline mr-2" />
                    Download Laporan PDF
                  </button>
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200">
                    <Printer className="h-4 w-4 inline mr-2" />
                    Cetak
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Expired Medications Modal */}
        {isExpiredModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-emerald-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-emerald-700">Monitoring Obat Kadaluarsa</h2>
                  <button
                    onClick={() => setIsExpiredModalOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-emerald-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-emerald-700 mb-2">Sudah Kadaluarsa</h3>
                    <p className="text-2xl font-bold text-emerald-600">0</p>
                    <p className="text-sm text-emerald-600">Item</p>
                  </div>
                  <div className="bg-emerald-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-emerald-700 mb-2">7 Hari Lagi</h3>
                    <p className="text-2xl font-bold text-emerald-600">3</p>
                    <p className="text-sm text-emerald-600">Item</p>
                  </div>
                  <div className="bg-emerald-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-emerald-700 mb-2">30 Hari Lagi</h3>
                    <p className="text-2xl font-bold text-emerald-600">7</p>
                    <p className="text-sm text-emerald-600">Item</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-emerald-700">Obat yang Akan Kadaluarsa</h3>
                  
                  <div className="space-y-3">
                    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900">Cefixime 200mg</h4>
                          <p className="text-sm text-gray-600">Batch: CF2024120 | Stok: 15 strip</p>
                          <p className="text-sm text-yellow-700">Kadaluarsa: 12 Desember 2025</p>
                        </div>
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">7 hari</span>
                      </div>
                    </div>

                    <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900">Vitamin B Complex</h4>
                          <p className="text-sm text-gray-600">Batch: VB2025010 | Stok: 25 botol</p>
                          <p className="text-sm text-orange-700">Kadaluarsa: 5 Januari 2026</p>
                        </div>
                        <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-sm">31 hari</span>
                      </div>
                    </div>

                    <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900">Antasida Suspensi</h4>
                          <p className="text-sm text-gray-600">Batch: AT2025015 | Stok: 8 botol</p>
                          <p className="text-sm text-orange-700">Kadaluarsa: 15 Januari 2026</p>
                        </div>
                        <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-sm">41 hari</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button className="flex-1 px-4 py-2 bg-emerald-500 text-white font-medium rounded-lg hover:bg-emerald-600">
                    Buat Laporan Disposal
                  </button>
                  <button className="px-4 py-2 bg-yellow-500 text-white font-medium rounded-lg hover:bg-yellow-600">
                    Tandai untuk Diskon
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI Drug Interaction Modal */}
        {isAiInteractionModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-emerald-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-emerald-700 flex items-center gap-2">
                    <Bot className="h-6 w-6" />
                    AI Drug Interaction Analyzer
                  </h2>
                  <button
                    onClick={() => setIsAiInteractionModalOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Bot className="h-5 w-5 text-emerald-600 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-emerald-700 mb-2">AI Analysis Dashboard</h3>
                      <p className="text-sm text-emerald-600">Sistem AI telah menganalisis 48 resep hari ini dan mendeteksi 3 potensi interaksi obat.</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-emerald-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-emerald-700 mb-2">Aman</h3>
                    <p className="text-2xl font-bold text-emerald-600">45</p>
                    <p className="text-sm text-emerald-600">Resep</p>
                  </div>
                  <div className="bg-emerald-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-emerald-700 mb-2">Perhatian</h3>
                    <p className="text-2xl font-bold text-emerald-600">2</p>
                    <p className="text-sm text-emerald-600">Interaksi Minor</p>
                  </div>
                  <div className="bg-emerald-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-emerald-700 mb-2">Bahaya</h3>
                    <p className="text-2xl font-bold text-emerald-600">1</p>
                    <p className="text-sm text-emerald-600">Interaksi Major</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-emerald-700">Interaksi Terdeteksi</h3>
                  
                  <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-medium text-red-800 mb-2">Interaksi Major - Yanto</h4>
                        <p className="text-sm text-red-700 mb-2">
                          <strong>Insulin Detemir + Atorvastatin</strong> dapat meningkatkan risiko hipoglikemia
                        </p>
                        <div className="bg-red-100 p-3 rounded">
                          <p className="text-xs text-red-800">
                            <strong>Rekomendasi AI:</strong> Monitor gula darah lebih sering, pertimbangkan penyesuaian dosis insulin, berikan edukasi pasien tentang gejala hipoglikemia.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-medium text-yellow-800 mb-2">Interaksi Minor - Budi Hartono</h4>
                        <p className="text-sm text-yellow-700 mb-2">
                          <strong>Captopril + Furosemide</strong> dapat menyebabkan hipotensi berlebihan
                        </p>
                        <div className="bg-yellow-100 p-3 rounded">
                          <p className="text-xs text-yellow-800">
                            <strong>Rekomendasi AI:</strong> Monitor tekanan darah dan elektrolit, mulai dengan dosis rendah, berikan edukasi tentang gejala hipotensi.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button className="flex-1 px-4 py-2 bg-emerald-500 text-white font-medium rounded-lg hover:bg-emerald-600">
                    Export AI Report
                  </button>
                  <button className="px-4 py-2 bg-emerald-500 text-white font-medium rounded-lg hover:bg-emerald-600">
                    Update AI Model
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApotekerPage;
