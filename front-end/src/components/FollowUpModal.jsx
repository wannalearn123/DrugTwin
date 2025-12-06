import React, { useState } from 'react';
import { 
  X, 
  Clock, 
  User, 
  FileText, 
  Activity, 
  Pill, 
  AlertTriangle, 
  CheckCircle,
  Calendar,
  Stethoscope,
  Heart,
  Thermometer,
  Droplets,
  Plus,
  Save,
  Edit
} from 'lucide-react';

const FollowUpModal = ({ isOpen, onClose, patient, onSave }) => {
  const [followUpData, setFollowUpData] = useState({
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString('en-US', { hour12: false }).slice(0, 5),
    type: 'routine',
    chiefComplaint: '',
    examination: '',
    diagnosis: '',
    treatment: '',
    prescription: [],
    vitalSigns: {
      bloodPressure: '',
      heartRate: '',
      temperature: '',
      weight: '',
      height: '',
      oxygenSaturation: ''
    },
    labOrders: [],
    nextAppointment: '',
    notes: '',
    status: 'active',
    priority: 'normal'
  });

  const [newPrescription, setNewPrescription] = useState({
    medication: '',
    dosage: '',
    frequency: '',
    duration: '',
    instructions: ''
  });

  const [newLabOrder, setNewLabOrder] = useState('');

  const handleInputChange = (field, value) => {
    setFollowUpData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleVitalSignChange = (field, value) => {
    setFollowUpData(prev => ({
      ...prev,
      vitalSigns: {
        ...prev.vitalSigns,
        [field]: value
      }
    }));
  };

  const handleAddPrescription = () => {
    if (newPrescription.medication && newPrescription.dosage) {
      setFollowUpData(prev => ({
        ...prev,
        prescription: [...prev.prescription, { 
          ...newPrescription, 
          id: Date.now(),
          status: 'new'
        }]
      }));
      setNewPrescription({
        medication: '',
        dosage: '',
        frequency: '',
        duration: '',
        instructions: ''
      });
    }
  };

  const handleRemovePrescription = (id) => {
    setFollowUpData(prev => ({
      ...prev,
      prescription: prev.prescription.filter(p => p.id !== id)
    }));
  };

  const handleAddLabOrder = () => {
    if (newLabOrder.trim()) {
      setFollowUpData(prev => ({
        ...prev,
        labOrders: [...prev.labOrders, { 
          test: newLabOrder,
          id: Date.now(),
          status: 'ordered'
        }]
      }));
      setNewLabOrder('');
    }
  };

  const handleRemoveLabOrder = (id) => {
    setFollowUpData(prev => ({
      ...prev,
      labOrders: prev.labOrders.filter(lab => lab.id !== id)
    }));
  };

  const handleSave = () => {
    // Validasi data minimal
    if (!followUpData.chiefComplaint || !followUpData.examination) {
      alert('Mohon lengkapi keluhan utama dan hasil pemeriksaan');
      return;
    }

    // Format data untuk disimpan
    const followUpRecord = {
      ...followUpData,
      patientId: patient.id,
      patientName: patient.name,
      doctorName: 'Dr. Yanto',
      timestamp: new Date().toISOString(),
      id: Date.now()
    };

    // Callback untuk menyimpan data
    if (onSave) {
      onSave(followUpRecord);
    }

    // Update status pasien jika diperlukan
    console.log('Follow-up record saved:', followUpRecord);
    alert('Follow-up berhasil disimpan!');
    onClose();
  };

  if (!isOpen || !patient) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
              <Clock size={24} className="text-emerald-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Follow-Up Pasien</h2>
              <p className="text-sm text-gray-600">{patient.name} - {patient.patientId}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="patient-card">
                <h3 className="font-semibold text-gray-800 mb-4">Informasi Kunjungan</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
                    <input
                      type="date"
                      value={followUpData.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Waktu</label>
                    <input
                      type="time"
                      value={followUpData.time}
                      onChange={(e) => handleInputChange('time', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>
                
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Kunjungan</label>
                  <select
                    value={followUpData.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="routine">Kontrol Rutin</option>
                    <option value="emergency">Darurat</option>
                    <option value="consultation">Konsultasi</option>
                    <option value="follow-up">Follow-up</option>
                  </select>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prioritas</label>
                  <select
                    value={followUpData.priority}
                    onChange={(e) => handleInputChange('priority', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="normal">Normal</option>
                    <option value="urgent">Mendesak</option>
                    <option value="critical">Kritis</option>
                  </select>
                </div>
              </div>

              {/* Vital Signs */}
              <div className="patient-card">
                <h3 className="font-semibold text-gray-800 mb-4">Vital Signs</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tekanan Darah</label>
                    <input
                      type="text"
                      placeholder="120/80"
                      value={followUpData.vitalSigns.bloodPressure}
                      onChange={(e) => handleVitalSignChange('bloodPressure', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Heart Rate (bpm)</label>
                    <input
                      type="number"
                      placeholder="72"
                      value={followUpData.vitalSigns.heartRate}
                      onChange={(e) => handleVitalSignChange('heartRate', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Suhu (°C)</label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="36.5"
                      value={followUpData.vitalSigns.temperature}
                      onChange={(e) => handleVitalSignChange('temperature', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Berat Badan (kg)</label>
                    <input
                      type="number"
                      placeholder="70"
                      value={followUpData.vitalSigns.weight}
                      onChange={(e) => handleVitalSignChange('weight', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Status Update */}
              <div className="patient-card">
                <h3 className="font-semibold text-gray-800 mb-4">Update Status Pasien</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={followUpData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="active">Aktif - Dalam Perawatan</option>
                    <option value="stable">Stabil - Kontrol Rutin</option>
                    <option value="follow-up">Follow-up - Perlu Monitoring</option>
                    <option value="recovered">Sembuh - Selesai Perawatan</option>
                    <option value="referred">Dirujuk - Ke Spesialis</option>
                  </select>
                </div>
                
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Jadwal Kontrol Berikutnya</label>
                  <input
                    type="date"
                    value={followUpData.nextAppointment}
                    onChange={(e) => handleInputChange('nextAppointment', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Clinical Assessment */}
              <div className="patient-card">
                <h3 className="font-semibold text-gray-800 mb-4">Pemeriksaan Klinis</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Keluhan Utama *</label>
                    <textarea
                      rows={3}
                      placeholder="Keluhan yang disampaikan pasien..."
                      value={followUpData.chiefComplaint}
                      onChange={(e) => handleInputChange('chiefComplaint', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hasil Pemeriksaan *</label>
                    <textarea
                      rows={3}
                      placeholder="Hasil pemeriksaan fisik dan observasi..."
                      value={followUpData.examination}
                      onChange={(e) => handleInputChange('examination', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Diagnosis</label>
                    <textarea
                      rows={2}
                      placeholder="Diagnosis atau assessment..."
                      value={followUpData.diagnosis}
                      onChange={(e) => handleInputChange('diagnosis', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rencana Terapi</label>
                    <textarea
                      rows={3}
                      placeholder="Rencana pengobatan dan tindakan..."
                      value={followUpData.treatment}
                      onChange={(e) => handleInputChange('treatment', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Prescription */}
              <div className="patient-card">
                <h3 className="font-semibold text-gray-800 mb-4">Resep Obat</h3>
                
                {/* Add New Prescription */}
                <div className="space-y-3 mb-4">
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Nama Obat"
                      value={newPrescription.medication}
                      onChange={(e) => setNewPrescription(prev => ({...prev, medication: e.target.value}))}
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                    <input
                      type="text"
                      placeholder="Dosis (mg)"
                      value={newPrescription.dosage}
                      onChange={(e) => setNewPrescription(prev => ({...prev, dosage: e.target.value}))}
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Frekuensi (3x sehari)"
                      value={newPrescription.frequency}
                      onChange={(e) => setNewPrescription(prev => ({...prev, frequency: e.target.value}))}
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                    <input
                      type="text"
                      placeholder="Durasi (7 hari)"
                      value={newPrescription.duration}
                      onChange={(e) => setNewPrescription(prev => ({...prev, duration: e.target.value}))}
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Instruksi khusus (setelah makan, dll)"
                    value={newPrescription.instructions}
                    onChange={(e) => setNewPrescription(prev => ({...prev, instructions: e.target.value}))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                  <button
                    onClick={handleAddPrescription}
                    className="w-full bg-emerald-50 text-emerald-600 py-2 rounded-lg hover:bg-emerald-100 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Plus size={16} />
                    <span>Tambah Obat</span>
                  </button>
                </div>

                {/* Prescription List */}
                {followUpData.prescription.length > 0 && (
                  <div className="space-y-2">
                    {followUpData.prescription.map((med) => (
                      <div key={med.id} className="bg-gray-50 rounded-lg p-3 flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{med.medication} {med.dosage}</p>
                          <p className="text-xs text-gray-600">{med.frequency} - {med.duration}</p>
                          {med.instructions && (
                            <p className="text-xs text-gray-500 italic">{med.instructions}</p>
                          )}
                        </div>
                        <button
                          onClick={() => handleRemovePrescription(med.id)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Lab Orders */}
              <div className="patient-card">
                <h3 className="font-semibold text-gray-800 mb-4">Pemeriksaan Lab</h3>
                <div className="flex space-x-2 mb-3">
                  <input
                    type="text"
                    placeholder="Pemeriksaan yang diminta (HbA1c, GDP, dll)"
                    value={newLabOrder}
                    onChange={(e) => setNewLabOrder(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                  <button
                    onClick={handleAddLabOrder}
                    className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                
                {followUpData.labOrders.length > 0 && (
                  <div className="space-y-2">
                    {followUpData.labOrders.map((lab) => (
                      <div key={lab.id} className="bg-gray-50 rounded-lg p-2 flex justify-between items-center">
                        <span className="text-sm">{lab.test}</span>
                        <button
                          onClick={() => handleRemoveLabOrder(lab.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Notes */}
              <div className="patient-card">
                <h3 className="font-semibold text-gray-800 mb-4">Catatan Tambahan</h3>
                <textarea
                  rows={4}
                  placeholder="Catatan khusus, instruksi untuk pasien, atau observasi lainnya..."
                  value={followUpData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">* Field yang wajib diisi</p>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors flex items-center space-x-2"
              >
                <Save size={16} />
                <span>Simpan Follow-Up</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FollowUpModal;