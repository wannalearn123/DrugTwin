import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  Filter, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  FileText, 
  Pill, 
  User, 
  Stethoscope,
  Calendar,
  MessageCircle,
  ChevronRight,
  Download,
  Printer,
  Send,
  Edit
} from 'lucide-react';

const ApotekerPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedResep, setSelectedResep] = useState(null);
  const [catatanFarmasi, setCatatanFarmasi] = useState('');

  // Data statistik
  const stats = [
    { label: "Menunggu Validasi", value: "12", color: "bg-yellow-100 text-yellow-800", icon: <Clock size={24} /> },
    { label: "Tervalidasi", value: "48", color: "bg-green-100 text-green-800", icon: <CheckCircle size={24} /> },
    { label: "Apt. Sarah", value: "Dr Marc PANOSI", color: "bg-blue-100 text-blue-800", icon: <User size={24} /> },
    { label: "Sebelumnya", value: "7", color: "bg-purple-100 text-purple-800", icon: <Calendar size={24} /> },
    { label: "AI Validasi Interaksi", value: "3", color: "bg-red-100 text-red-800", icon: <AlertTriangle size={24} /> }
  ];

  // Data resep
  const resepList = [
    {
      id: 1,
      patientName: "Yanto",
      patientId: "PAT001",
      doctor: "Dr. Yanto",
      date: "2025-11-01",
      status: "pending",
      drugs: [
        { name: "Insulin Detemir 100 U/ml", dosage: "1x/hari", amount: "1 vial" },
        { name: "Ambedipine 5 mg", dosage: "1x/hari", amount: "30 tablet" },
        { name: "Metformin 500mg", dosage: "3x/hari", amount: "90 tablet" }
      ],
      aiValidation: {
        diagnosisMatch: true,
        noDuplication: true,
        stockAvailable: true
      },
      warnings: ["Potensi interaksi Ambedipine dan insulin"],
      interactionLevel: "warning"
    },
    {
      id: 2,
      patientName: "Budi Santoso",
      patientId: "PAT002",
      doctor: "Dr. Sarah",
      date: "2025-11-01",
      status: "validated",
      drugs: [
        { name: "Rifampicin 450mg", dosage: "1x/hari", amount: "30 tablet" },
        { name: "Isoniazid 300mg", dosage: "1x/hari", amount: "30 tablet" },
        { name: "Pyrazinamide 1500mg", dosage: "1x/hari", amount: "30 tablet" }
      ],
      aiValidation: {
        diagnosisMatch: true,
        noDuplication: true,
        stockAvailable: true
      },
      warnings: [],
      interactionLevel: "none"
    },
    {
      id: 3,
      patientName: "Siti Aminah",
      patientId: "PAT003",
      doctor: "Dr. Yanto",
      date: "2025-10-31",
      status: "diterbitkan",
      drugs: [
        { name: "Lisinopril 10mg", dosage: "1x/hari", amount: "30 tablet" }
      ],
      aiValidation: {
        diagnosisMatch: true,
        noDuplication: true,
        stockAvailable: true
      },
      warnings: [],
      interactionLevel: "none"
    }
  ];

  // Filter resep berdasarkan status
  const filteredResep = filterStatus === 'all' 
    ? resepList 
    : resepList.filter(resep => resep.status === filterStatus);

  const handleValidate = (id) => {
    alert(`Resep #${id} divalidasi`);
  };

  const handleContactDoctor = (doctor) => {
    alert(`Hubungi ${doctor}`);
  };

  const handleSubstitution = (id) => {
    alert(`Substitusi untuk Resep #${id}`);
  };

  const handleSendNote = (id) => {
    if (catatanFarmasi.trim()) {
      alert(`Catatan untuk Resep #${id}: ${catatanFarmasi}`);
      setCatatanFarmasi('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">DRUG TWIN</h1>
              <p className="text-gray-600">Dashboard Apoteker</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari resep atau pasien..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
              </div>
              
              <button className="relative p-2 hover:bg-gray-100 rounded-lg">
                <Bell size={24} className="text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                  S
                </div>
                <span className="font-medium text-gray-700">Apt. Sarah</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={stat.color + " p-3 rounded-lg"}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Resep List */}
          <div className="lg:col-span-2">
            {/* Filter Tabs */}
            <div className="bg-white rounded-xl shadow mb-6">
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setFilterStatus('all')}
                  className={`flex-1 py-3 px-4 text-center font-medium ${filterStatus === 'all' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
                >
                  Semua Resep
                </button>
                <button
                  onClick={() => setFilterStatus('pending')}
                  className={`flex-1 py-3 px-4 text-center font-medium ${filterStatus === 'pending' ? 'text-yellow-600 border-b-2 border-yellow-600' : 'text-gray-600 hover:text-gray-800'}`}
                >
                  Menunggu Validasi
                </button>
                <button
                  onClick={() => setFilterStatus('validated')}
                  className={`flex-1 py-3 px-4 text-center font-medium ${filterStatus === 'validated' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-600 hover:text-gray-800'}`}
                >
                  Tervalidasi
                </button>
                <button
                  onClick={() => setFilterStatus('diterbitkan')}
                  className={`flex-1 py-3 px-4 text-center font-medium ${filterStatus === 'diterbitkan' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-600 hover:text-gray-800'}`}
                >
                  Diterbitkan
                </button>
              </div>

              {/* Resep List */}
              <div className="p-4">
                {filteredResep.map((resep) => (
                  <div key={resep.id} className="mb-6 last:mb-0">
                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                      {/* Resep Header */}
                      <div className="p-4 border-b border-gray-200">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center space-x-2 mb-2">
                              <FileText size={20} className="text-blue-600" />
                              <h3 className="text-lg font-semibold text-gray-800">
                                Resep #{resep.id} - {resep.patientName}
                              </h3>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                resep.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                resep.status === 'validated' ? 'bg-green-100 text-green-800' :
                                'bg-purple-100 text-purple-800'
                              }`}>
                                {resep.status === 'pending' ? 'Menunggu Validasi' :
                                 resep.status === 'validated' ? 'Tervalidasi' : 'Diterbitkan'}
                              </span>
                            </div>
                            
                            <div className="space-y-1 text-sm text-gray-600">
                              <div className="flex items-center">
                                <User size={16} className="mr-2" />
                                <span>ID Pasien: {resep.patientId}</span>
                              </div>
                              <div className="flex items-center">
                                <Stethoscope size={16} className="mr-2" />
                                <span>Dokter: {resep.doctor}</span>
                              </div>
                              <div className="flex items-center">
                                <Calendar size={16} className="mr-2" />
                                <span>{resep.date}</span>
                              </div>
                            </div>
                          </div>
                          
                          <button 
                            onClick={() => setSelectedResep(resep)}
                            className="text-blue-600 hover:text-blue-800 p-2"
                          >
                            <ChevronRight size={24} />
                          </button>
                        </div>
                      </div>

                      {/* Daftar Obat */}
                      <div className="p-4 border-b border-gray-200">
                        <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                          <Pill size={18} className="mr-2" />
                          Daftar Obat:
                        </h4>
                        <div className="space-y-2">
                          {resep.drugs.map((drug, index) => (
                            <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                              <span className="font-medium">{drug.name}</span>
                              <div className="text-sm text-gray-600">
                                <span>{drug.dosage}</span>
                                <span className="mx-2">•</span>
                                <span>{drug.amount}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* AI Validation & Warnings */}
                      <div className="p-4 border-b border-gray-200">
                        <h4 className="font-medium text-gray-700 mb-3">Hasil Validasi AI:</h4>
                        <div className="grid grid-cols-3 gap-2 mb-3">
                          <div className="flex items-center text-green-600">
                            <CheckCircle size={18} className="mr-2" />
                            <span className="text-sm">Dosis sesuai</span>
                          </div>
                          <div className="flex items-center text-green-600">
                            <CheckCircle size={18} className="mr-2" />
                            <span className="text-sm">Tidak ada duplikasi</span>
                          </div>
                          <div className="flex items-center text-green-600">
                            <CheckCircle size={18} className="mr-2" />
                            <span className="text-sm">Stok tersedia</span>
                          </div>
                        </div>

                        {resep.warnings.length > 0 && (
                          <div className={`p-3 rounded-lg ${resep.interactionLevel === 'warning' ? 'bg-yellow-50 border border-yellow-200' : 'bg-red-50 border border-red-200'}`}>
                            <div className="flex items-start">
                              <AlertTriangle size={20} className={`mr-2 ${resep.interactionLevel === 'warning' ? 'text-yellow-600' : 'text-red-600'}`} />
                              <div>
                                <p className="font-medium text-gray-800">Peringatan Interaksi</p>
                                <p className="text-sm text-gray-600">{resep.warnings[0]}</p>
                                <p className="text-sm text-gray-500 mt-1">Perhatikan interaksi obat yang terdeteksi</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="p-4">
                        <div className="flex space-x-3">
                          {resep.status === 'pending' ? (
                            <>
                              <button
                                onClick={() => handleValidate(resep.id)}
                                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition duration-200 flex items-center justify-center"
                              >
                                <CheckCircle size={20} className="mr-2" />
                                Validasi & Terbitkan
                              </button>
                              <button
                                onClick={() => handleContactDoctor(resep.doctor)}
                                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition duration-200 flex items-center justify-center"
                              >
                                <MessageCircle size={20} className="mr-2" />
                                Hubungi Dokter
                              </button>
                              <button
                                onClick={() => handleSubstitution(resep.id)}
                                className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-purple-700 transition duration-200 flex items-center justify-center"
                              >
                                <Edit size={20} className="mr-2" />
                                Sarankan Substitusi
                              </button>
                            </>
                          ) : resep.status === 'validated' ? (
                            <button
                              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition duration-200 flex items-center justify-center"
                            >
                              <Send size={20} className="mr-2" />
                              Sudah Diberikan
                            </button>
                          ) : (
                            <button
                              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition duration-200 flex items-center justify-center"
                            >
                              Lihat Detail
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Catatan Farmasi */}
                      <div className="p-4 bg-gray-50 rounded-b-xl">
                        <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                          <FileText size={18} className="mr-2" />
                          Catatan Farmasi Kritis:
                        </h4>
                        <div className="flex space-x-2">
                          <textarea
                            placeholder="Tambahkan catatan untuk dokter atau pasien..."
                            value={catatanFarmasi}
                            onChange={(e) => setCatatanFarmasi(e.target.value)}
                            className="flex-1 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            rows="2"
                          />
                          <button
                            onClick={() => handleSendNote(resep.id)}
                            className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition duration-200"
                          >
                            Simpan
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Aksi Cepat</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-200">
                  <span className="font-medium text-gray-700">Resep Baru</span>
                  <FileText size={20} className="text-gray-500" />
                </button>
                <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-200">
                  <span className="font-medium text-gray-700">Cek Stok Obat</span>
                  <Pill size={20} className="text-gray-500" />
                </button>
                <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-200">
                  <span className="font-medium text-gray-700">Laporan Harian</span>
                  <Download size={20} className="text-gray-500" />
                </button>
                <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-200">
                  <span className="font-medium text-gray-700">Cetak Label</span>
                  <Printer size={20} className="text-gray-500" />
                </button>
              </div>
            </div>

            {/* Interaction Alerts */}
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Alert Interaksi Obat</h3>
              <div className="space-y-4">
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start">
                    <AlertTriangle size={20} className="text-red-600 mr-2" />
                    <div>
                      <p className="font-medium text-gray-800">Warfarin + NSAID</p>
                      <p className="text-sm text-gray-600">Risiko perdarahan meningkat</p>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start">
                    <AlertTriangle size={20} className="text-yellow-600 mr-2" />
                    <div>
                      <p className="font-medium text-gray-800">Metformin + Kontras</p>
                      <p className="text-sm text-gray-600">Risiko asidosis laktat</p>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start">
                    <CheckCircle size={20} className="text-green-600 mr-2" />
                    <div>
                      <p className="font-medium text-gray-800">Sistem AI Aktif</p>
                      <p className="text-sm text-gray-600">Memantau 48 resep aktif</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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
    </div>
  );
};

export default ApotekerPage;