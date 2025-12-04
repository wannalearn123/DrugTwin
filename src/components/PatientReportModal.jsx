import React, { useState } from 'react';
import { FileText as FileMedical } from 'lucide-react';
import {
  X,
  Download,
  Printer,
  Mail,
  FileText,
  Calendar,
  User,
  Stethoscope,
  Pill,
  Activity,
  Heart,
  Thermometer,
  Droplets,
  TrendingUp,
  AlertTriangle,
  Clock,
  FileBarChart,
  Pill as PillIcon,
  CheckCircle,
  AlertCircle,
  Scale,
  Ruler,
  BookOpen,
} from 'lucide-react';

const PatientReportModal = ({ 
  isOpen, 
  onClose, 
  patient,
  doctorInfo = {
    name: "Dr. Yanto",
    license: "12345/DPMPTSP/2023",
    specialty: "Penyakit Dalam"
  }
}) => {
  const [reportType, setReportType] = useState('summary');
  const [includeVitals, setIncludeVitals] = useState(true);
  const [includeMedications, setIncludeMedications] = useState(true);
  const [includeAIRecommendations, setIncludeAIRecommendations] = useState(true);
  const [includeHistory, setIncludeHistory] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen || !patient) return null;

  // Format tanggal
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Generate report content based on selections
  const generateReportContent = () => {
    const sections = [];

    // Header
    sections.push({
      title: "LAPORAN MEDIS PASIEN",
      type: "header",
      content: [
        `Nama Pasien: ${patient.name}`,
        `ID Pasien: ${patient.patientId}`,
        `Tanggal Lahir: ${patient.age} tahun`,
        `Jenis Kelamin: ${patient.gender}`,
        `Tanggal Laporan: ${new Date().toLocaleDateString('id-ID')}`
      ]
    });

    // Diagnosis
    sections.push({
      title: "DIAGNOSIS",
      icon: <Stethoscope size={18} />,
      content: [
        `Diagnosis Utama: ${patient.diagnosis}`,
        `Status: ${patient.status === 'active' ? 'Aktif' : 'Follow-up'}`,
        `Terakhir Kunjungan: ${formatDate(patient.lastVisit)}`
      ]
    });

    // Vital Signs
    if (includeVitals && patient.vitalSigns) {
      const vitalContent = [];
      if (patient.vitalSigns.bloodPressure) vitalContent.push(`Tekanan Darah: ${patient.vitalSigns.bloodPressure}`);
      if (patient.vitalSigns.heartRate) vitalContent.push(`Detak Jantung: ${patient.vitalSigns.heartRate} bpm`);
      if (patient.vitalSigns.temperature) vitalContent.push(`Suhu Tubuh: ${patient.vitalSigns.temperature}°C`);
      if (patient.vitalSigns.glucose) vitalContent.push(`Glukosa Darah: ${patient.vitalSigns.glucose} mg/dL`);
      if (patient.vitalSigns.hba1c) vitalContent.push(`HbA1c: ${patient.vitalSigns.hba1c}`);
      
      if (vitalContent.length > 0) {
        sections.push({
          title: "TANDA VITAL TERAKHIR",
          icon: <Activity size={18} />,
          content: vitalContent
        });
      }
    }

    // Medications
    if (includeMedications && patient.medications && patient.medications.length > 0) {
      sections.push({
        title: "REGIMEN TERAPI",
        icon: <Pill size={18} />,
        content: patient.medications.map(med => 
          `• ${med.name} - ${med.dosage} (${med.status === 'active' ? 'Aktif' : 'Non-aktif'})`
        )
      });
    }

    // AI Recommendations
    if (includeAIRecommendations && patient.aiRecommendations && patient.aiRecommendations.length > 0) {
      sections.push({
        title: "REKOMENDASI AI",
        icon: <AlertTriangle size={18} />,
        content: patient.aiRecommendations.map(rec => `• ${rec}`)
      });
    }

    // Medical History (if available)
    if (includeHistory) {
      sections.push({
        title: "RIWAYAT MEDIS",
        icon: <BookOpen size={18} />,
        content: [
          `Pasien dalam pengawasan sejak: ${formatDate(patient.lastVisit)}`,
          `Status terkini: ${patient.status === 'active' ? 'Stabil' : 'Perlu monitoring'}`,
          `Jumlah obat aktif: ${patient.medications?.length || 0}`,
          `Rekomendasi tindak lanjut: Monitoring rutin setiap 1 bulan`
        ]
      });
    }

    // Doctor's Notes
    sections.push({
      title: "CATATAN DOKTER",
      icon: <FileMedical size={18} />,
      content: [
        `Dokter Penanggung Jawab: ${doctorInfo.name}`,
        `SIP: ${doctorInfo.license}`,
        `Spesialisasi: ${doctorInfo.specialty}`,
        `\nTindakan yang direkomendasikan:`,
        `1. Kontrol rutin setiap bulan`,
        `2. Monitoring tanda vital mandiri`,
        `3. Kepatuhan minum obat`,
        `4. Diet dan gaya hidup sehat`
      ]
    });

    return sections;
  };

  const handleGeneratePDF = () => {
    setIsGenerating(true);
    // Simulate PDF generation
    setTimeout(() => {
      setIsGenerating(false);
      alert(`Laporan untuk ${patient.name} berhasil di-generate!`);
    }, 1500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleEmailReport = () => {
    const email = prompt('Masukkan email tujuan:');
    if (email) {
      alert(`Laporan akan dikirim ke ${email}`);
    }
  };

  const reportSections = generateReportContent();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden print:max-h-none print:shadow-none">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100 print:bg-white">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <FileBarChart size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Laporan Medis Pasien</h2>
              <p className="text-sm text-gray-600">Generate laporan lengkap untuk {patient.name}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="p-2 text-gray-600 hover:bg-white rounded-lg transition duration-200 print:hidden"
              title="Cetak"
            >
              <Printer size={24} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:bg-white rounded-lg transition duration-200 print:hidden"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Report Options */}
        <div className="p-6 border-b border-gray-200 bg-gray-50 print:hidden">
          <h3 className="font-semibold text-gray-800 mb-4">Pilih Konten Laporan</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Report Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Laporan</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="summary">Ringkasan</option>
                <option value="detailed">Detail Lengkap</option>
                <option value="medication">Laporan Obat</option>
                <option value="followup">Laporan Follow-up</option>
              </select>
            </div>

            {/* Checkboxes */}
            <div className="space-y-2">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={includeVitals}
                  onChange={(e) => setIncludeVitals(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Tanda Vital</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={includeMedications}
                  onChange={(e) => setIncludeMedications(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Daftar Obat</span>
              </label>
            </div>

            <div className="space-y-2">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={includeAIRecommendations}
                  onChange={(e) => setIncludeAIRecommendations(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Rekomendasi AI</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={includeHistory}
                  onChange={(e) => setIncludeHistory(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Riwayat Medis</span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col space-y-2">
              <button
                onClick={handleGeneratePDF}
                disabled={isGenerating}
                className={`px-4 py-2 rounded-lg font-medium transition duration-200 ${
                  isGenerating 
                    ? 'bg-blue-400 cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                } flex items-center justify-center`}
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Download size={18} className="mr-2" />
                    Download PDF
                  </>
                )}
              </button>
              <button
                onClick={handleEmailReport}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition duration-200 flex items-center justify-center"
              >
                <Mail size={18} className="mr-2" />
                Kirim Email
              </button>
            </div>
          </div>
        </div>

        {/* Report Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh] print:max-h-none">
          {/* Report Header - Printable */}
          <div className="text-center mb-8 border-b pb-6 print:block hidden">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                <FileText size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">DRUG TWIN</h1>
                <p className="text-gray-600">AI-Powered Clinical Decision Support System</p>
              </div>
            </div>
            <h2 className="text-xl font-bold text-gray-800">LAPORAN MEDIS PASIEN</h2>
            <p className="text-gray-600">Tanggal: {new Date().toLocaleDateString('id-ID')}</p>
          </div>

          {/* Patient Info Card */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <User size={24} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Nama Pasien</p>
                  <p className="font-bold text-lg text-gray-800">{patient.name}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">ID Pasien</p>
                <p className="font-bold text-lg text-gray-800">{patient.patientId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className={`font-bold text-lg ${
                  patient.status === 'active' ? 'text-green-600' : 'text-yellow-600'
                }`}>
                  {patient.status === 'active' ? 'Aktif' : 'Follow-up'}
                </p>
              </div>
            </div>
          </div>

          {/* Report Sections */}
          <div className="space-y-6">
            {reportSections.map((section, index) => (
              <div key={index} className="border border-gray-200 rounded-xl overflow-hidden">
                {/* Section Header */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center">
                  {section.icon && <span className="mr-3">{section.icon}</span>}
                  <h3 className="font-bold text-gray-800">{section.title}</h3>
                </div>
                
                {/* Section Content */}
                <div className="p-6">
                  {section.type === 'header' ? (
                    <div className="text-center">
                      {section.content.map((line, idx) => (
                        <p key={idx} className={`${idx === 0 ? 'text-xl font-bold' : 'text-gray-700'}`}>
                          {line}
                        </p>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {section.content.map((item, idx) => (
                        <p key={idx} className="text-gray-700">{item}</p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Vital Signs Grid */}
          {includeVitals && patient.vitalSigns && (
            <div className="mt-6">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                <Activity size={20} className="mr-2" />
                Data Tanda Vital Terkini
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {patient.vitalSigns.bloodPressure && (
                  <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                    <Activity size={24} className="text-red-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Tekanan Darah</p>
                    <p className="text-xl font-bold text-gray-800">{patient.vitalSigns.bloodPressure}</p>
                  </div>
                )}
                {patient.vitalSigns.heartRate && (
                  <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                    <Heart size={24} className="text-pink-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Detak Jantung</p>
                    <p className="text-xl font-bold text-gray-800">{patient.vitalSigns.heartRate} bpm</p>
                  </div>
                )}
                {patient.vitalSigns.temperature && (
                  <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                    <Thermometer size={24} className="text-orange-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Suhu Tubuh</p>
                    <p className="text-xl font-bold text-gray-800">{patient.vitalSigns.temperature}°C</p>
                  </div>
                )}
                {patient.vitalSigns.glucose && (
                  <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                    <Droplets size={24} className="text-blue-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Glukosa Darah</p>
                    <p className="text-xl font-bold text-gray-800">{patient.vitalSigns.glucose} mg/dL</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Medications Table */}
          {includeMedications && patient.medications && patient.medications.length > 0 && (
            <div className="mt-6">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                <PillIcon size={20} className="mr-2" />
                Daftar Obat Aktif
              </h3>
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Obat</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dosis</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keterangan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {patient.medications.map((med, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <PillIcon size={16} className="text-blue-600 mr-2" />
                            <span className="font-medium">{med.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">{med.dosage}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            med.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {med.status === 'active' ? 'Aktif' : 'Non-aktif'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">Diambil sesuai resep</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Footer - Printable */}
          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-500 text-sm print:block hidden">
            <p>Laporan ini dibuat secara otomatis oleh sistem Drug Twin</p>
            <p className="mt-1">© {new Date().getFullYear()} Drug Twin • AI-Powered Clinical Decision Support System</p>
            <div className="mt-4 flex justify-center space-x-6">
              <p>Dokter: {doctorInfo.name}</p>
              <p>SIP: {doctorInfo.license}</p>
              <p>Spesialisasi: {doctorInfo.specialty}</p>
            </div>
            <div className="mt-2 text-xs">
              <p>Halaman 1 dari 1 • Dicetak pada: {new Date().toLocaleString('id-ID')}</p>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50 print:hidden">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              <p>Laporan untuk: <span className="font-medium">{patient.name}</span></p>
              <p>Tanggal dibuat: {new Date().toLocaleDateString('id-ID')}</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition duration-200"
              >
                Tutup
              </button>
              <button
                onClick={handleGeneratePDF}
                disabled={isGenerating}
                className={`px-5 py-2.5 rounded-lg font-medium transition duration-200 ${
                  isGenerating 
                    ? 'bg-blue-400 cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isGenerating ? 'Membuat PDF...' : 'Download Laporan'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientReportModal;