import React, { useState } from 'react';
import {
  X,
  Send,
  Download,
  Printer,
  User,
  Stethoscope,
  Building,
  MapPin,
  Phone,
  Mail,
  Calendar,
  FileText,
  AlertCircle,
  Clock,
  Plus,
  Search,
  ChevronRight,
  CheckCircle,
  Pill,
  Activity,
  Heart
} from 'lucide-react';

const PatientReferralModal = ({ 
  isOpen, 
  onClose, 
  patient,
  doctorInfo = {
    name: "Dr. Yanto",
    license: "12345/DPMPTSP/2023",
    specialty: "Penyakit Dalam",
    hospital: "RSUD Kota Besar",
    address: "Jl. Kesehatan No. 123",
    phone: "(021) 1234-5678",
    email: "dr.yanto@rsudkota.com"
  }
}) => {
  const [referralType, setReferralType] = useState('specialist');
  const [priorityLevel, setPriorityLevel] = useState('routine');
  const [selectedSpecialist, setSelectedSpecialist] = useState('');
  const [selectedHospital, setSelectedHospital] = useState('');
  const [referralReason, setReferralReason] = useState('');
  const [clinicalSummary, setClinicalSummary] = useState('');
  const [testsRequested, setTestsRequested] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Data spesialis
  const specialists = [
    { id: 1, name: "Dr. Andi Kardiologi", specialty: "Kardiologi", hospital: "RS Jantung Sehat" },
    { id: 2, name: "Dr. Budi Neurologi", specialty: "Neurologi", hospital: "RS Saraf Sejahtera" },
    { id: 3, name: "Dr. Citra Endokrin", specialty: "Endokrinologi", hospital: "RS Diabetes Center" },
    { id: 4, name: "Dr. Dian Gastroenterologi", specialty: "Gastroenterologi", hospital: "RS Pencernaan" },
    { id: 5, name: "Dr. Eka Pulmonologi", specialty: "Pulmonologi", hospital: "RS Paru-paru" },
    { id: 6, name: "Dr. Fajar Nefrologi", specialty: "Nefrologi", hospital: "RS Ginjal" },
    { id: 7, name: "Dr. Gina Reumatologi", specialty: "Reumatologi", hospital: "RS Tulang Sendi" },
    { id: 8, name: "Dr. Hadi Psikiatri", specialty: "Psikiatri", hospital: "RS Jiwa Sehat" }
  ];

  // Data rumah sakit
  const hospitals = [
    { id: 1, name: "RSUD Kota Besar", type: "Umum", address: "Jl. Kesehatan No. 123" },
    { id: 2, name: "RS Jantung Sehat", type: "Khusus Jantung", address: "Jl. Jantung No. 45" },
    { id: 3, name: "RS Saraf Sejahtera", type: "Khusus Saraf", address: "Jl. Saraf No. 67" },
    { id: 4, name: "RS Diabetes Center", type: "Khusus Diabetes", address: "Jl. Diabetes No. 89" },
    { id: 5, name: "RS Pencernaan", type: "Khusus Pencernaan", address: "Jl. Pencernaan No. 101" },
    { id: 6, name: "RS Paru-paru", type: "Khusus Paru", address: "Jl. Paru-paru No. 112" },
    { id: 7, name: "RS Ginjal", type: "Khusus Ginjal", address: "Jl. Ginjal No. 131" },
    { id: 8, name: "RS Tulang Sendi", type: "Khusus Ortopedi", address: "Jl. Tulang No. 415" }
  ];

  // Prioritas rujukan
  const priorityOptions = [
    { value: 'emergency', label: 'Darurat (24 jam)', color: 'bg-red-100 text-red-800' },
    { value: 'urgent', label: 'Mendesak (48 jam)', color: 'bg-orange-100 text-orange-800' },
    { value: 'routine', label: 'Rutin (1-2 minggu)', color: 'bg-green-100 text-green-800' },
    { value: 'elective', label: 'Elektif (>2 minggu)', color: 'bg-blue-100 text-blue-800' }
  ];

  // Tipe rujukan
  const referralTypes = [
    { value: 'specialist', label: 'Spesialis' },
    { value: 'hospital', label: 'Rumah Sakit' },
    { value: 'diagnostic', label: 'Diagnostik' },
    { value: 'rehabilitation', label: 'Rehabilitasi' },
    { value: 'second_opinion', label: 'Second Opinion' }
  ];

  if (!isOpen || !patient) return null;

  // Format tanggal
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Handle submit referral
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedSpecialist && !selectedHospital) {
      alert('Pilih spesialis atau rumah sakit tujuan');
      return;
    }

    if (!referralReason.trim()) {
      alert('Alasan rujukan wajib diisi');
      return;
    }

    setIsSubmitting(true);

    // Prepare referral data
    const referralData = {
      patient: {
        id: patient.id,
        name: patient.name,
        patientId: patient.patientId,
        age: patient.age,
        gender: patient.gender,
        diagnosis: patient.diagnosis
      },
      referral: {
        type: referralType,
        priority: priorityLevel,
        specialist: selectedSpecialist,
        hospital: selectedHospital,
        reason: referralReason,
        clinicalSummary: clinicalSummary || `Pasien dengan diagnosis ${patient.diagnosis}, memerlukan konsultasi lebih lanjut.`,
        testsRequested: testsRequested ? testsRequested.split(',').map(t => t.trim()) : [],
        followUpDate: followUpDate,
        notes: additionalNotes,
        date: new Date().toISOString(),
        status: 'pending'
      },
      referringDoctor: doctorInfo
    };

    try {
      // Simulate API call
      console.log('Referral data:', referralData);
      
      // Success
      setTimeout(() => {
        setIsSubmitting(false);
        alert('Rujukan berhasil dibuat! Kode Rujukan: REF-' + Date.now().toString().slice(-6));
        
        // Generate referral letter
        generateReferralLetter(referralData);
        
        // Reset form
        resetForm();
        onClose();
      }, 1500);
      
    } catch (error) {
      setIsSubmitting(false);
      alert('Gagal membuat rujukan. Silakan coba lagi.');
    }
  };

  const generateReferralLetter = (data) => {
    // This would generate a PDF or document in real implementation
    console.log('Generating referral letter for:', data.patient.name);
  };

  const resetForm = () => {
    setReferralType('specialist');
    setPriorityLevel('routine');
    setSelectedSpecialist('');
    setSelectedHospital('');
    setReferralReason('');
    setClinicalSummary('');
    setTestsRequested('');
    setFollowUpDate('');
    setAdditionalNotes('');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    alert('Surat rujukan akan didownload dalam format PDF');
  };

  // Filter specialists based on search
  const filteredSpecialists = specialists.filter(spec =>
    spec.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    spec.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-orange-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center">
              <Send size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Rujukan Pasien</h2>
              <p className="text-sm text-gray-600">Buat rujukan untuk {patient.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white rounded-lg transition duration-200"
          >
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          <form onSubmit={handleSubmit}>
            {/* Patient Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <User size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Pasien</p>
                    <p className="font-bold text-gray-800">{patient.name}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Diagnosis</p>
                  <p className="font-bold text-gray-800">{patient.diagnosis}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">ID Pasien</p>
                  <p className="font-bold text-gray-800">{patient.patientId}</p>
                </div>
              </div>
            </div>

            {/* Referral Type & Priority */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Referral Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jenis Rujukan *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {referralTypes.map(type => (
                    <label
                      key={type.value}
                      className={`flex items-center p-3 border rounded-lg cursor-pointer transition duration-200 ${
                        referralType === type.value
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="referralType"
                        value={type.value}
                        checked={referralType === type.value}
                        onChange={(e) => setReferralType(e.target.value)}
                        className="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                      />
                      <span className="ml-2 text-sm font-medium">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Priority Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tingkat Prioritas *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {priorityOptions.map(priority => (
                    <label
                      key={priority.value}
                      className={`flex items-center p-3 border rounded-lg cursor-pointer transition duration-200 ${
                        priorityLevel === priority.value
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="priorityLevel"
                        value={priority.value}
                        checked={priorityLevel === priority.value}
                        onChange={(e) => setPriorityLevel(e.target.value)}
                        className="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                      />
                      <span className={`ml-2 text-sm font-medium ${priority.color}`}>
                        {priority.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Specialist/Hospital Selection */}
            {referralType === 'specialist' && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pilih Spesialis Tujuan *
                </label>
                <div className="relative">
                  <div className="flex items-center border border-gray-300 rounded-lg p-3 mb-3">
                    <Search size={20} className="text-gray-400 mr-2" />
                    <input
                      type="text"
                      placeholder="Cari spesialis atau bidang..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="flex-1 outline-none"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto p-2">
                    {filteredSpecialists.map(specialist => (
                      <div
                        key={specialist.id}
                        onClick={() => setSelectedSpecialist(specialist.name)}
                        className={`p-4 border rounded-lg cursor-pointer transition duration-200 ${
                          selectedSpecialist === specialist.name
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center">
                              <Stethoscope size={18} className="text-orange-600 mr-2" />
                              <p className="font-medium text-gray-800">{specialist.name}</p>
                            </div>
                            <div className="ml-6 mt-1">
                              <p className="text-sm text-gray-600">Spesialisasi: {specialist.specialty}</p>
                              <p className="text-sm text-gray-600">Rumah Sakit: {specialist.hospital}</p>
                            </div>
                          </div>
                          {selectedSpecialist === specialist.name && (
                            <CheckCircle size={20} className="text-green-600" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {referralType === 'hospital' && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pilih Rumah Sakit Tujuan *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto p-2">
                  {hospitals.map(hospital => (
                    <div
                      key={hospital.id}
                      onClick={() => setSelectedHospital(hospital.name)}
                      className={`p-4 border rounded-lg cursor-pointer transition duration-200 ${
                        selectedHospital === hospital.name
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center">
                            <Building size={18} className="text-orange-600 mr-2" />
                            <p className="font-medium text-gray-800">{hospital.name}</p>
                          </div>
                          <div className="ml-6 mt-2 space-y-1">
                            <p className="text-sm text-gray-600 flex items-center">
                              <MapPin size={14} className="mr-1" />
                              {hospital.address}
                            </p>
                            <p className="text-sm text-gray-600">
                              Tipe: {hospital.type}
                            </p>
                          </div>
                        </div>
                        {selectedHospital === hospital.name && (
                          <CheckCircle size={20} className="text-green-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Referral Details */}
            <div className="space-y-6">
              {/* Referral Reason */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alasan Rujukan *
                </label>
                <textarea
                  value={referralReason}
                  onChange={(e) => setReferralReason(e.target.value)}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-200"
                  placeholder="Jelaskan alasan rujukan secara detail..."
                  required
                />
              </div>

              {/* Clinical Summary */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ringkasan Klinis
                </label>
                <textarea
                  value={clinicalSummary}
                  onChange={(e) => setClinicalSummary(e.target.value)}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-200"
                  placeholder="Ringkasan kondisi pasien, pemeriksaan yang sudah dilakukan, hasil lab, dll."
                  defaultValue={`Pasien ${patient.name}, ${patient.age} tahun, ${patient.gender}, dengan diagnosis ${patient.diagnosis}.`}
                />
              </div>

              {/* Tests Requested */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pemeriksaan yang Diminta
                </label>
                <input
                  type="text"
                  value={testsRequested}
                  onChange={(e) => setTestsRequested(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-200"
                  placeholder="Contoh: CT Scan kepala, EEG, MRI, dll. (pisahkan dengan koma)"
                />
              </div>

              {/* Follow-up Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal Follow-up yang Dianjurkan
                </label>
                <input
                  type="date"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-200"
                />
              </div>

              {/* Additional Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catatan Tambahan
                </label>
                <textarea
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  rows="2"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-200"
                  placeholder="Catatan khusus untuk dokter/spesialis tujuan..."
                />
              </div>
            </div>

            {/* Referring Doctor Info */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="font-medium text-gray-700 mb-3">Dokter Perujuk</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Nama Dokter</p>
                  <p className="font-medium text-gray-800">{doctorInfo.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">SIP</p>
                  <p className="font-medium text-gray-800">{doctorInfo.license}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Rumah Sakit</p>
                  <p className="font-medium text-gray-800">{doctorInfo.hospital}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Kontak</p>
                  <p className="font-medium text-gray-800">{doctorInfo.phone}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition duration-200 flex items-center"
                >
                  <Printer size={18} className="mr-2" />
                  Print
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="px-4 py-2.5 border border-blue-300 text-blue-700 rounded-lg font-medium hover:bg-blue-50 transition duration-200 flex items-center"
                >
                  <Download size={18} className="mr-2" />
                  Download Template
                </button>
              </div>
              
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition duration-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-5 py-2.5 rounded-lg font-medium transition duration-200 flex items-center ${
                    isSubmitting
                      ? 'bg-orange-400 cursor-not-allowed'
                      : 'bg-orange-600 text-white hover:bg-orange-700'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Mengirim...
                    </>
                  ) : (
                    <>
                      <Send size={18} className="mr-2" />
                      Buat Rujukan
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Preview Section (Print Only) */}
        <div className="hidden print:block p-8">
          {/* Letterhead */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mr-4">
                <Stethoscope size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">SURAT RUJUKAN</h1>
                <p className="text-gray-600">Nomor: REF-{Date.now().toString().slice(-6)}</p>
              </div>
            </div>
          </div>

          {/* Patient Info */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">DATA PASIEN</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p><strong>Nama:</strong> {patient.name}</p>
                <p><strong>Umur:</strong> {patient.age} tahun</p>
                <p><strong>Jenis Kelamin:</strong> {patient.gender}</p>
              </div>
              <div>
                <p><strong>ID Pasien:</strong> {patient.patientId}</p>
                <p><strong>Diagnosis:</strong> {patient.diagnosis}</p>
                <p><strong>Tanggal Rujukan:</strong> {new Date().toLocaleDateString('id-ID')}</p>
              </div>
            </div>
          </div>

          {/* Referral Details */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">DETAIL RUJUKAN</h2>
            <div className="space-y-2">
              <p><strong>Tujuan:</strong> {selectedSpecialist || selectedHospital}</p>
              <p><strong>Prioritas:</strong> {priorityOptions.find(p => p.value === priorityLevel)?.label}</p>
              <p><strong>Alasan Rujukan:</strong> {referralReason}</p>
              {clinicalSummary && <p><strong>Ringkasan Klinis:</strong> {clinicalSummary}</p>}
              {testsRequested && <p><strong>Pemeriksaan Diminta:</strong> {testsRequested}</p>}
              {followUpDate && <p><strong>Follow-up Dianjurkan:</strong> {formatDate(followUpDate)}</p>}
            </div>
          </div>

          {/* Doctor Signature */}
          <div className="mt-16">
            <div className="text-right">
              <p className="mb-12">Hormat kami,</p>
              <div className="inline-block border-t border-gray-400 pt-4">
                <p className="font-bold">{doctorInfo.name}</p>
                <p>{doctorInfo.specialty}</p>
                <p>SIP: {doctorInfo.license}</p>
                <p>{doctorInfo.hospital}</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-gray-300 text-center text-sm text-gray-500">
            <p>Surat rujukan ini dibuat secara elektronik dan sah tanpa tanda tangan basah</p>
            <p>© {new Date().getFullYear()} Drug Twin • Sistem Rujukan Elektronik</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientReferralModal;