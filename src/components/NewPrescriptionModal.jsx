import React, { useState, useEffect } from 'react';
import {
  X,
  Search,
  Plus,
  Trash2,
  Pill,
  Calendar,
  Clock,
  User,
  Stethoscope,
  AlertCircle,
  CheckCircle,
  ChevronDown,
  FileText,
  Info,
  Calculator
} from 'lucide-react';

const NewPrescriptionModal = ({ 
  isOpen, 
  onClose, 
  onSubmit,
  patientData = null,
  doctorData = null
}) => {
  // Mock data for drugs (in real app, this would come from API)
  const drugOptions = [
    { id: 1, name: 'Metformin 500mg', category: 'Antidiabetic', generic: 'Metformin' },
    { id: 2, name: 'Glimepiride 2mg', category: 'Antidiabetic', generic: 'Glimepiride' },
    { id: 3, name: 'Insulin Glargine 100U/ml', category: 'Antidiabetic', generic: 'Insulin Glargine' },
    { id: 4, name: 'Lisinopril 10mg', category: 'Antihypertensive', generic: 'Lisinopril' },
    { id: 5, name: 'Amlodipine 5mg', category: 'Antihypertensive', generic: 'Amlodipine' },
    { id: 6, name: 'Hydrochlorothiazide 25mg', category: 'Antihypertensive', generic: 'Hydrochlorothiazide' },
    { id: 7, name: 'Atorvastatin 20mg', category: 'Statin', generic: 'Atorvastatin' },
    { id: 8, name: 'Simvastatin 40mg', category: 'Statin', generic: 'Simvastatin' },
    { id: 9, name: 'Aspirin 100mg', category: 'Antiplatelet', generic: 'Aspirin' },
    { id: 10, name: 'Clopidogrel 75mg', category: 'Antiplatelet', generic: 'Clopidogrel' },
    { id: 11, name: 'Omeprazole 20mg', category: 'PPI', generic: 'Omeprazole' },
    { id: 12, name: 'Cetirizine 10mg', category: 'Antihistamine', generic: 'Cetirizine' },
    { id: 13, name: 'Amoxicillin 500mg', category: 'Antibiotic', generic: 'Amoxicillin' },
    { id: 14, name: 'Paracetamol 500mg', category: 'Analgesic', generic: 'Paracetamol' },
    { id: 15, name: 'Ibuprofen 400mg', category: 'NSAID', generic: 'Ibuprofen' }
  ];

  // Dose units
  const doseUnits = [
    { value: 'mg', label: 'mg' },
    { value: 'g', label: 'g' },
    { value: 'mcg', label: 'mcg' },
    { value: 'ml', label: 'ml' },
    { value: 'tablespoon', label: 'sendok makan' },
    { value: 'teaspoon', label: 'sendok teh' },
    { value: 'drop', label: 'tetes' },
    { value: 'unit', label: 'unit' },
    { value: 'tablet', label: 'tablet' },
    { value: 'capsule', label: 'kapsul' },
    { value: 'inhalation', label: 'inhalasi' },
    { value: 'patch', label: 'patch' }
  ];

  // Frequency options
  const frequencyOptions = [
    { value: 'once_daily', label: '1x sehari' },
    { value: 'twice_daily', label: '2x sehari' },
    { value: 'three_times_daily', label: '3x sehari' },
    { value: 'four_times_daily', label: '4x sehari' },
    { value: 'every_6_hours', label: 'Setiap 6 jam' },
    { value: 'every_8_hours', label: 'Setiap 8 jam' },
    { value: 'every_12_hours', label: 'Setiap 12 jam' },
    { value: 'weekly', label: '1x seminggu' },
    { value: 'monthly', label: '1x sebulan' },
    { value: 'as_needed', label: 'Sesuai kebutuhan' },
    { value: 'before_meals', label: 'Sebelum makan' },
    { value: 'after_meals', label: 'Sesudah makan' },
    { value: 'at_bedtime', label: 'Sebelum tidur' }
  ];

  // Duration units
  const durationUnits = [
    { value: 'days', label: 'hari' },
    { value: 'weeks', label: 'minggu' },
    { value: 'months', label: 'bulan' },
    { value: 'indefinite', label: 'terus menerus' },
    { value: 'until_finished', label: 'hingga habis' }
  ];

  // Route of administration
  const routeOptions = [
    { value: 'oral', label: 'Oral (minum)' },
    { value: 'sublingual', label: 'Sublingual' },
    { value: 'topical', label: 'Topikal (oles)' },
    { value: 'inhalation', label: 'Inhalasi' },
    { value: 'injection', label: 'Suntikan' },
    { value: 'intravenous', label: 'Intravena (IV)' },
    { value: 'intramuscular', label: 'Intramuskular (IM)' },
    { value: 'subcutaneous', label: 'Subkutan (SC)' },
    { value: 'rectal', label: 'Rektal' },
    { value: 'vaginal', label: 'Vaginal' },
    { value: 'ophthalmic', label: 'Mata' },
    { value: 'otic', label: 'Telinga' },
    { value: 'nasal', label: 'Hidung' }
  ];

  const [formData, setFormData] = useState({
    patientId: patientData?.id || '',
    patientName: patientData?.name || '',
    diagnosis: patientData?.diagnosis?.primary || '',
    prescriptionDate: new Date().toISOString().split('T')[0],
    validUntil: '',
    notes: '',
    instructions: '',
    
    // Medications array
    medications: [
      {
        id: Date.now(),
        drugId: '',
        drugName: '',
        genericName: '',
        strength: '',
        dosage: {
          amount: '',
          unit: 'mg',
          frequency: 'once_daily',
          route: 'oral',
          duration: {
            value: '',
            unit: 'days'
          },
          timing: '',
          withFood: ''
        },
        quantity: '',
        refills: 0,
        substitutionAllowed: true
      }
    ]
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [showDrugDropdown, setShowDrugDropdown] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [drugInteractions, setDrugInteractions] = useState([]);

  // Filter drugs based on search
  const filteredDrugs = drugOptions.filter(drug =>
    drug.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    drug.generic.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate valid until date (default: +30 days)
  useEffect(() => {
    if (!formData.validUntil) {
      const date = new Date();
      date.setDate(date.getDate() + 30);
      setFormData(prev => ({
        ...prev,
        validUntil: date.toISOString().split('T')[0]
      }));
    }
  }, []);

  // Check for drug interactions
  useEffect(() => {
    const checkInteractions = () => {
      const meds = formData.medications.filter(m => m.drugId);
      if (meds.length > 1) {
        // Mock interaction check (in real app, this would call an API)
        const interactions = [];
        const drugNames = meds.map(m => m.drugName);
        
        // Example interaction rules
        if (drugNames.includes('Warfarin') && drugNames.includes('Aspirin')) {
          interactions.push('Warfarin + Aspirin: Risiko perdarahan meningkat');
        }
        if (drugNames.includes('Metformin') && drugNames.includes('Ibuprofen')) {
          interactions.push('Metformin + NSAID: Risiko asidosis laktat');
        }
        
        setDrugInteractions(interactions);
      } else {
        setDrugInteractions([]);
      }
    };
    
    checkInteractions();
  }, [formData.medications]);

  const handleChange = (e, medicationIndex = null, fieldPath = null) => {
    const { name, value, type, checked } = e.target;
    
    if (medicationIndex !== null) {
      // Update medication field
      setFormData(prev => {
        const updatedMeds = [...prev.medications];
        
        if (fieldPath) {
          // Handle nested fields (e.g., dosage.amount)
          const path = fieldPath.split('.');
          let obj = updatedMeds[medicationIndex];
          
          for (let i = 0; i < path.length - 1; i++) {
            obj = obj[path[i]];
          }
          
          obj[path[path.length - 1]] = type === 'checkbox' ? checked : value;
        } else {
          updatedMeds[medicationIndex][name] = type === 'checkbox' ? checked : value;
        }
        
        return { ...prev, medications: updatedMeds };
      });
    } else {
      // Update main form field
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
    
    // Clear error for this field
    if (errors[name] || errors[`medication_${medicationIndex}`]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        delete newErrors[`medication_${medicationIndex}`];
        return newErrors;
      });
    }
  };

  const handleDrugSelect = (drug, medicationIndex) => {
    setFormData(prev => {
      const updatedMeds = [...prev.medications];
      updatedMeds[medicationIndex] = {
        ...updatedMeds[medicationIndex],
        drugId: drug.id,
        drugName: drug.name,
        genericName: drug.generic,
        strength: drug.name.match(/\d+/)?.[0] || ''
      };
      return { ...prev, medications: updatedMeds };
    });
    
    setShowDrugDropdown(false);
    setSearchTerm('');
  };

  const addMedication = () => {
    setFormData(prev => ({
      ...prev,
      medications: [
        ...prev.medications,
        {
          id: Date.now() + Math.random(),
          drugId: '',
          drugName: '',
          genericName: '',
          strength: '',
          dosage: {
            amount: '',
            unit: 'mg',
            frequency: 'once_daily',
            route: 'oral',
            duration: {
              value: '',
              unit: 'days'
            },
            timing: '',
            withFood: ''
          },
          quantity: '',
          refills: 0,
          substitutionAllowed: true
        }
      ]
    }));
  };

  const removeMedication = (index) => {
    if (formData.medications.length > 1) {
      setFormData(prev => ({
        ...prev,
        medications: prev.medications.filter((_, i) => i !== index)
      }));
    }
  };

  const calculateQuantity = (medicationIndex) => {
    const med = formData.medications[medicationIndex];
    if (med.dosage.amount && med.dosage.duration.value) {
      const amount = parseFloat(med.dosage.amount);
      const duration = parseFloat(med.dosage.duration.value);
      let frequencyMultiplier = 1;
      
      switch (med.dosage.frequency) {
        case 'once_daily': frequencyMultiplier = 1; break;
        case 'twice_daily': frequencyMultiplier = 2; break;
        case 'three_times_daily': frequencyMultiplier = 3; break;
        case 'four_times_daily': frequencyMultiplier = 4; break;
        case 'every_6_hours': frequencyMultiplier = 4; break;
        case 'every_8_hours': frequencyMultiplier = 3; break;
        case 'every_12_hours': frequencyMultiplier = 2; break;
        case 'weekly': frequencyMultiplier = 1/7; break;
        case 'monthly': frequencyMultiplier = 1/30; break;
        default: frequencyMultiplier = 1;
      }
      
      const total = amount * frequencyMultiplier * duration;
      
      setFormData(prev => {
        const updatedMeds = [...prev.medications];
        updatedMeds[medicationIndex].quantity = Math.ceil(total).toString();
        return { ...prev, medications: updatedMeds };
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validate patient
    if (!formData.patientId && !formData.patientName) {
      newErrors.patient = 'Pasien harus dipilih';
    }
    
    // Validate diagnosis
    if (!formData.diagnosis.trim()) {
      newErrors.diagnosis = 'Diagnosis wajib diisi';
    }
    
    // Validate medications
    formData.medications.forEach((med, index) => {
      if (!med.drugId) {
        newErrors[`medication_${index}`] = 'Obat harus dipilih';
      }
      if (!med.dosage.amount) {
        newErrors[`medication_${index}_dosage`] = 'Dosis wajib diisi';
      }
      if (!med.dosage.frequency) {
        newErrors[`medication_${index}_frequency`] = 'Frekuensi wajib dipilih';
      }
      if (!med.quantity) {
        newErrors[`medication_${index}_quantity`] = 'Jumlah wajib diisi';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare data for API
      const prescriptionData = {
        patient_id: formData.patientId,
        patient_name: formData.patientName,
        diagnosis: formData.diagnosis,
        prescription_date: formData.prescriptionDate,
        valid_until: formData.validUntil,
        notes: formData.notes,
        instructions: formData.instructions,
        medications: formData.medications.map(med => ({
          drug_id: med.drugId,
          drug_name: med.drugName,
          generic_name: med.genericName,
          strength: med.strength,
          dosage: {
            amount: med.dosage.amount,
            unit: med.dosage.unit,
            frequency: med.dosage.frequency,
            route: med.dosage.route,
            duration: {
              value: med.dosage.duration.value,
              unit: med.dosage.duration.unit
            },
            timing: med.dosage.timing,
            with_food: med.dosage.withFood
          },
          quantity: med.quantity,
          refills: med.refills,
          substitution_allowed: med.substitutionAllowed
        }))
      };
      
      // API call would go here
      console.log('Prescription data:', prescriptionData);
      
      if (onSubmit) {
        onSubmit(prescriptionData);
      }
      
      // Reset form
      resetForm();
      onClose();
      
    } catch (error) {
      console.error('Error submitting prescription:', error);
      setErrors({ submit: 'Gagal membuat resep. Silakan coba lagi.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      patientId: patientData?.id || '',
      patientName: patientData?.name || '',
      diagnosis: patientData?.diagnosis?.primary || '',
      prescriptionDate: new Date().toISOString().split('T')[0],
      validUntil: '',
      notes: '',
      instructions: '',
      medications: [
        {
          id: Date.now(),
          drugId: '',
          drugName: '',
          genericName: '',
          strength: '',
          dosage: {
            amount: '',
            unit: 'mg',
            frequency: 'once_daily',
            route: 'oral',
            duration: {
              value: '',
              unit: 'days'
            },
            timing: '',
            withFood: ''
          },
          quantity: '',
          refills: 0,
          substitutionAllowed: true
        }
      ]
    });
    setErrors({});
    setSearchTerm('');
    setShowDrugDropdown(false);
    setDrugInteractions([]);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-green-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
              <FileText size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Resep Baru</h2>
              <p className="text-sm text-gray-600">Buat resep obat untuk pasien</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-white rounded-lg transition duration-200"
          >
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          <form onSubmit={handleSubmit}>
            {/* Patient & Diagnosis Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Patient Info */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User size={16} className="mr-2 text-blue-600" />
                    Pasien
                  </label>
                  {patientData ? (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="font-medium text-gray-800">{patientData.name}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <span>ID: {patientData.patientId}</span>
                        <span>{patientData.age} tahun</span>
                      </div>
                    </div>
                  ) : (
                    <div className="relative">
                      <input
                        type="text"
                        name="patientName"
                        value={formData.patientName}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${
                          errors.patient ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="Cari atau masukkan nama pasien"
                      />
                      {errors.patient && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle size={14} className="mr-1" />
                          {errors.patient}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Diagnosis */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Stethoscope size={16} className="mr-2 text-red-600" />
                    Diagnosis
                  </label>
                  <input
                    type="text"
                    name="diagnosis"
                    value={formData.diagnosis}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${
                      errors.diagnosis ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Masukkan diagnosis"
                  />
                  {errors.diagnosis && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle size={14} className="mr-1" />
                      {errors.diagnosis}
                    </p>
                  )}
                </div>
              </div>

              {/* Prescription Dates */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar size={16} className="mr-2 text-green-600" />
                      Tanggal Resep
                    </label>
                    <input
                      type="date"
                      name="prescriptionDate"
                      value={formData.prescriptionDate}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Berlaku Hingga
                    </label>
                    <input
                      type="date"
                      name="validUntil"
                      value={formData.validUntil}
                      onChange={handleChange}
                      min={formData.prescriptionDate}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    />
                  </div>
                </div>

                {/* Doctor Info */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <User size={16} className="mr-2 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Dokter Penulis:</span>
                  </div>
                  <p className="text-gray-800 font-medium">Dr. Yanto</p>
                  <p className="text-sm text-gray-600">SIP: 12345/DPMPTSP/2023</p>
                </div>
              </div>
            </div>

            {/* Medications Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <Pill size={20} className="mr-2 text-purple-600" />
                  Daftar Obat
                </h3>
                <button
                  type="button"
                  onClick={addMedication}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-200 flex items-center"
                >
                  <Plus size={18} className="mr-2" />
                  Tambah Obat
                </button>
              </div>

              {/* Drug Interactions Warning */}
              {drugInteractions.length > 0 && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start">
                    <AlertTriangle size={20} className="text-red-600 mr-2 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-red-800 mb-2">Peringatan Interaksi Obat:</p>
                      <ul className="text-sm text-red-700 space-y-1">
                        {drugInteractions.map((interaction, idx) => (
                          <li key={idx} className="flex items-start">
                            <AlertTriangle size={14} className="mr-2 mt-0.5 flex-shrink-0" />
                            {interaction}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Medications List */}
              <div className="space-y-4">
                {formData.medications.map((medication, index) => (
                  <div key={medication.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                          <Pill size={16} className="text-purple-600" />
                        </div>
                        <span className="font-medium text-gray-700">Obat #{index + 1}</span>
                      </div>
                      {formData.medications.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeMedication(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition duration-200"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>

                    {/* Drug Selection */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pilih Obat *
                      </label>
                      <div className="relative">
                        <div className="flex items-center">
                          <div className="relative flex-1">
                            <input
                              type="text"
                              value={medication.drugName || searchTerm}
                              onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setShowDrugDropdown(true);
                                setActiveDropdown(index);
                              }}
                              onFocus={() => {
                                setShowDrugDropdown(true);
                                setActiveDropdown(index);
                              }}
                              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${
                                errors[`medication_${index}`] ? 'border-red-300 bg-red-50' : 'border-gray-300'
                              }`}
                              placeholder="Cari nama obat..."
                            />
                            <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
                            
                            {/* Drug Dropdown */}
                            {showDrugDropdown && activeDropdown === index && (
                              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                {filteredDrugs.length > 0 ? (
                                  filteredDrugs.map(drug => (
                                    <div
                                      key={drug.id}
                                      onClick={() => handleDrugSelect(drug, index)}
                                      className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                    >
                                      <div className="flex items-center justify-between">
                                        <div>
                                          <p className="font-medium text-gray-800">{drug.name}</p>
                                          <p className="text-sm text-gray-600">{drug.generic} • {drug.category}</p>
                                        </div>
                                        {medication.drugId === drug.id && (
                                          <CheckCircle size={18} className="text-green-600" />
                                        )}
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <div className="px-4 py-3 text-gray-500">
                                    Obat tidak ditemukan
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                          
                          {medication.strength && (
                            <div className="ml-2">
                              <div className="px-3 py-2 bg-blue-100 text-blue-800 rounded-lg font-medium">
                                {medication.strength}
                              </div>
                            </div>
                          )}
                        </div>
                        {errors[`medication_${index}`] && (
                          <p className="mt-1 text-sm text-red-600 flex items-center">
                            <AlertCircle size={14} className="mr-1" />
                            {errors[`medication_${index}`]}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Dosage & Frequency */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      {/* Dosage Amount */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Dosis *
                        </label>
                        <div className="flex">
                          <input
                            type="number"
                            value={medication.dosage.amount}
                            onChange={(e) => handleChange(e, index, 'dosage.amount')}
                            onBlur={() => calculateQuantity(index)}
                            step="0.1"
                            className={`flex-1 px-4 py-3 border rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${
                              errors[`medication_${index}_dosage`] ? 'border-red-300 bg-red-50' : 'border-gray-300'
                            }`}
                            placeholder="0"
                          />
                          <select
                            value={medication.dosage.unit}
                            onChange={(e) => handleChange(e, index, 'dosage.unit')}
                            className="px-4 py-3 border border-l-0 border-gray-300 rounded-r-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                          >
                            {doseUnits.map(unit => (
                              <option key={unit.value} value={unit.value}>
                                {unit.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        {errors[`medication_${index}_dosage`] && (
                          <p className="mt-1 text-sm text-red-600 flex items-center">
                            <AlertCircle size={14} className="mr-1" />
                            {errors[`medication_${index}_dosage`]}
                          </p>
                        )}
                      </div>

                      {/* Frequency */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Frekuensi *
                        </label>
                        <select
                          value={medication.dosage.frequency}
                          onChange={(e) => handleChange(e, index, 'dosage.frequency')}
                          onBlur={() => calculateQuantity(index)}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${
                            errors[`medication_${index}_frequency`] ? 'border-red-300 bg-red-50' : 'border-gray-300'
                          }`}
                        >
                          {frequencyOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        {errors[`medication_${index}_frequency`] && (
                          <p className="mt-1 text-sm text-red-600 flex items-center">
                            <AlertCircle size={14} className="mr-1" />
                            {errors[`medication_${index}_frequency`]}
                          </p>
                        )}
                      </div>

                      {/* Route */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Rute Pemberian
                        </label>
                        <select
                          value={medication.dosage.route}
                          onChange={(e) => handleChange(e, index, 'dosage.route')}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                        >
                          {routeOptions.map(route => (
                            <option key={route.value} value={route.value}>
                              {route.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Duration & Quantity */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      {/* Duration */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Durasi Pengobatan
                        </label>
                        <div className="flex">
                          <input
                            type="number"
                            value={medication.dosage.duration.value}
                            onChange={(e) => handleChange(e, index, 'dosage.duration.value')}
                            onBlur={() => calculateQuantity(index)}
                            className="flex-1 px-4 py-3 border rounded-l-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                            placeholder="7"
                          />
                          <select
                            value={medication.dosage.duration.unit}
                            onChange={(e) => handleChange(e, index, 'dosage.duration.unit')}
                            className="px-4 py-3 border border-l-0 border-gray-300 rounded-r-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                          >
                            {durationUnits.map(unit => (
                              <option key={unit.value} value={unit.value}>
                                {unit.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Quantity */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Jumlah *
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            value={medication.quantity}
                            onChange={(e) => handleChange(e, index, 'quantity')}
                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${
                              errors[`medication_${index}_quantity`] ? 'border-red-300 bg-red-50' : 'border-gray-300'
                            }`}
                            placeholder="0"
                          />
                          <Calculator className="absolute left-3 top-3.5 text-gray-400" size={20} />
                        </div>
                        {errors[`medication_${index}_quantity`] && (
                          <p className="mt-1 text-sm text-red-600 flex items-center">
                            <AlertCircle size={14} className="mr-1" />
                            {errors[`medication_${index}_quantity`]}
                          </p>
                        )}
                        {medication.dosage.amount && medication.dosage.frequency && medication.dosage.duration.value && (
                          <p className="text-xs text-gray-500 mt-1">
                            Auto-calculated based on dosage and duration
                          </p>
                        )}
                      </div>

                      {/* Refills */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Pengulangan (Refill)
                        </label>
                        <div className="flex items-center">
                          <button
                            type="button"
                            onClick={() => {
                              if (medication.refills > 0) {
                                handleChange({
                                  target: { name: 'refills', value: medication.refills - 1 }
                                }, index);
                              }
                            }}
                            className="px-3 py-2 border border-gray-300 rounded-l-lg bg-gray-100 hover:bg-gray-200"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            name="refills"
                            value={medication.refills}
                            onChange={(e) => handleChange(e, index)}
                            className="w-16 px-2 py-2 border-t border-b border-gray-300 text-center"
                            min="0"
                            max="5"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (medication.refills < 5) {
                                handleChange({
                                  target: { name: 'refills', value: medication.refills + 1 }
                                }, index);
                              }
                            }}
                            className="px-3 py-2 border border-gray-300 rounded-r-lg bg-gray-100 hover:bg-gray-200"
                          >
                            +
                          </button>
                          <span className="ml-2 text-sm text-gray-600">kali</span>
                        </div>
                      </div>
                    </div>

                    {/* Additional Instructions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Waktu Minum
                        </label>
                        <input
                          type="text"
                          value={medication.dosage.timing}
                          onChange={(e) => handleChange(e, index, 'dosage.timing')}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                          placeholder="Contoh: Pagi dan malam"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Hubungan dengan Makan
                        </label>
                        <select
                          value={medication.dosage.withFood}
                          onChange={(e) => handleChange(e, index, 'dosage.withFood')}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                        >
                          <option value="">Pilih...</option>
                          <option value="before_meal">Sebelum makan</option>
                          <option value="after_meal">Setelah makan</option>
                          <option value="with_meal">Bersama makan</option>
                          <option value="empty_stomach">Perut kosong</option>
                        </select>
                      </div>
                    </div>

                    {/* Substitution Allowed */}
                    <div className="mt-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="substitutionAllowed"
                          checked={medication.substitutionAllowed}
                          onChange={(e) => handleChange(e, index)}
                          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          Izinkan substitusi dengan obat generik
                        </span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Notes & Instructions */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Info size={20} className="mr-2 text-blue-600" />
                Instruksi & Catatan Tambahan
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Instruksi Khusus untuk Pasien
                  </label>
                  <textarea
                    name="instructions"
                    value={formData.instructions}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholder="Contoh: Hindari alkohol, pantau gula darah, dll."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catatan untuk Farmasi
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholder="Catatan khusus untuk apoteker"
                  />
                </div>
              </div>
            </div>

            {/* Error Message */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center text-red-600">
                  <AlertCircle size={20} className="mr-2" />
                  <p>{errors.submit}</p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleClose}
                className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition duration-200"
              >
                Batal
              </button>
              
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    // Preview functionality
                    console.log('Preview prescription:', formData);
                    alert('Fitur preview akan datang!');
                  }}
                  className="px-5 py-2.5 border border-blue-300 text-blue-700 rounded-lg font-medium hover:bg-blue-50 transition duration-200"
                >
                  Preview
                </button>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-5 py-2.5 rounded-lg font-medium transition duration-200 ${
                    isSubmitting
                      ? 'bg-green-400 cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Menyimpan...
                    </span>
                  ) : (
                    'Buat Resep'
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewPrescriptionModal;