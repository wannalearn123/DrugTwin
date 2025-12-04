import React, { useState } from 'react';
import {
  X,
  User,
  Calendar,
  Activity,
  Heart,
  Thermometer,
  Droplets,
  Scale,
  Ruler,
  AlertCircle,
  CheckCircle,
  Upload,
  Camera
} from 'lucide-react';

const AddPatientModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    // Personal Info
    fullName: '',
    dateOfBirth: '',
    age: '',
    gender: '',
    phoneNumber: '',
    email: '',
    address: '',
    emergencyContact: '',
    
    // Medical Info
    bloodType: '',
    allergies: '',
    chronicConditions: '',
    previousSurgeries: '',
    familyHistory: '',
    
    // Vital Signs (optional)
    vitalSigns: {
      bloodPressure: '',
      heartRate: '',
      temperature: '',
      respiratoryRate: '',
      oxygenSaturation: '',
      weight: '',
      height: '',
      bloodGlucose: '',
      bmi: ''
    },
    
    // Initial Diagnosis
    primaryDiagnosis: '',
    secondaryDiagnosis: '',
    symptoms: '',
    notes: '',
    
    // Insurance
    insuranceProvider: '',
    insuranceNumber: '',
    
    // Photo
    photo: null
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (name.includes('.')) {
      // Handle nested objects (vitalSigns)
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else if (type === 'file') {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const calculateAge = (dateString) => {
    if (!dateString) return '';
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age.toString();
  };

  const handleDateChange = (e) => {
    const dateValue = e.target.value;
    setFormData(prev => ({
      ...prev,
      dateOfBirth: dateValue,
      age: calculateAge(dateValue)
    }));
  };

  const calculateBMI = () => {
    const weight = parseFloat(formData.vitalSigns.weight);
    const height = parseFloat(formData.vitalSigns.height) / 100; // Convert cm to m
    
    if (weight && height && height > 0) {
      const bmi = (weight / (height * height)).toFixed(1);
      setFormData(prev => ({
        ...prev,
        vitalSigns: {
          ...prev.vitalSigns,
          bmi
        }
      }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = 'Nama lengkap wajib diisi';
      if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Tanggal lahir wajib diisi';
      if (!formData.gender) newErrors.gender = 'Jenis kelamin wajib dipilih';
      if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Nomor telepon wajib diisi';
    }

    if (step === 2) {
      if (!formData.primaryDiagnosis.trim()) {
        newErrors.primaryDiagnosis = 'Diagnosis utama wajib diisi';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) {
      return;
    }

    if (currentStep < 4) {
      handleNextStep();
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Prepare data for API
      const patientData = {
        personal_info: {
          full_name: formData.fullName,
          date_of_birth: formData.dateOfBirth,
          age: parseInt(formData.age) || 0,
          gender: formData.gender,
          phone_number: formData.phoneNumber,
          email: formData.email || null,
          address: formData.address || null,
          emergency_contact: formData.emergencyContact || null
        },
        medical_info: {
          blood_type: formData.bloodType || null,
          allergies: formData.allergies ? formData.allergies.split(',').map(a => a.trim()) : [],
          chronic_conditions: formData.chronicConditions || null,
          previous_surgeries: formData.previousSurgeries || null,
          family_history: formData.familyHistory || null
        },
        vital_signs: Object.keys(formData.vitalSigns).some(key => formData.vitalSigns[key]) 
          ? formData.vitalSigns 
          : null,
        diagnosis: {
          primary: formData.primaryDiagnosis,
          secondary: formData.secondaryDiagnosis || null,
          symptoms: formData.symptoms ? formData.symptoms.split(',').map(s => s.trim()) : [],
          notes: formData.notes || null
        },
        insurance: formData.insuranceProvider ? {
          provider: formData.insuranceProvider,
          number: formData.insuranceNumber
        } : null
      };

      // If photo is selected, you would need to handle file upload separately
      if (formData.photo) {
        // Handle file upload here
        const formDataToSend = new FormData();
        formDataToSend.append('photo', formData.photo);
        formDataToSend.append('patient_data', JSON.stringify(patientData));
        
        // Example API call with FormData
        // await fetch('/api/patients', {
        //   method: 'POST',
        //   body: formDataToSend
        // });
      } else {
        // Example API call without file
        // await fetch('/api/patients', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(patientData)
        // });
      }

      // Call onSubmit callback
      if (onSubmit) {
        onSubmit(patientData);
      }

      // Reset form and close modal
      resetForm();
      onClose();
      
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ submit: 'Gagal menyimpan data pasien. Silakan coba lagi.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      dateOfBirth: '',
      age: '',
      gender: '',
      phoneNumber: '',
      email: '',
      address: '',
      emergencyContact: '',
      bloodType: '',
      allergies: '',
      chronicConditions: '',
      previousSurgeries: '',
      familyHistory: '',
      vitalSigns: {
        bloodPressure: '',
        heartRate: '',
        temperature: '',
        respiratoryRate: '',
        oxygenSaturation: '',
        weight: '',
        height: '',
        bloodGlucose: '',
        bmi: ''
      },
      primaryDiagnosis: '',
      secondaryDiagnosis: '',
      symptoms: '',
      notes: '',
      insuranceProvider: '',
      insuranceNumber: '',
      photo: null
    });
    setCurrentStep(1);
    setErrors({});
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
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <User size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Tambah Pasien Baru</h2>
              <p className="text-sm text-gray-600">Lengkapi data pasien untuk registrasi baru</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-white rounded-lg transition duration-200"
          >
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep >= step 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {step}
                </div>
                <div className={`ml-2 text-sm font-medium ${
                  currentStep >= step ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  {step === 1 && 'Data Pribadi'}
                  {step === 2 && 'Diagnosis'}
                  {step === 3 && 'Tanda Vital'}
                  {step === 4 && 'Review'}
                </div>
                {step < 4 && (
                  <div className={`h-0.5 w-12 mx-2 ${
                    currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <User size={20} className="mr-2 text-blue-600" />
                    Data Pribadi Pasien
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nama Lengkap *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${
                          errors.fullName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="Masukkan nama lengkap"
                      />
                      {errors.fullName && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle size={14} className="mr-1" />
                          {errors.fullName}
                        </p>
                      )}
                    </div>

                    {/* Date of Birth */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tanggal Lahir *
                      </label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleDateChange}
                        max={new Date().toISOString().split('T')[0]}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${
                          errors.dateOfBirth ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                      />
                      {errors.dateOfBirth && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle size={14} className="mr-1" />
                          {errors.dateOfBirth}
                        </p>
                      )}
                      {formData.age && (
                        <p className="mt-1 text-sm text-gray-600">
                          Usia: <span className="font-medium">{formData.age} tahun</span>
                        </p>
                      )}
                    </div>

                    {/* Gender */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Jenis Kelamin *
                      </label>
                      <div className="flex space-x-4">
                        {['Male', 'Female'].map((gender) => (
                          <label key={gender} className="flex items-center">
                            <input
                              type="radio"
                              name="gender"
                              value={gender}
                              checked={formData.gender === gender}
                              onChange={handleChange}
                              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-gray-700">
                              {gender === 'Male' ? 'Laki-laki' : 'Perempuan'}
                            </span>
                          </label>
                        ))}
                      </div>
                      {errors.gender && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle size={14} className="mr-1" />
                          {errors.gender}
                        </p>
                      )}
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nomor Telepon *
                      </label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${
                          errors.phoneNumber ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="08xxxxxxxxxx"
                      />
                      {errors.phoneNumber && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle size={14} className="mr-1" />
                          {errors.phoneNumber}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                        placeholder="pasien@example.com"
                      />
                    </div>

                    {/* Address */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Alamat
                      </label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        rows="2"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                        placeholder="Masukkan alamat lengkap"
                      />
                    </div>

                    {/* Emergency Contact */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Kontak Darurat
                      </label>
                      <input
                        type="text"
                        name="emergencyContact"
                        value={formData.emergencyContact}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                        placeholder="Nama & nomor telepon"
                      />
                    </div>

                    {/* Blood Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Golongan Darah
                      </label>
                      <select
                        name="bloodType"
                        value={formData.bloodType}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                      >
                        <option value="">Pilih golongan darah</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Diagnosis & Medical History */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <Activity size={20} className="mr-2 text-blue-600" />
                    Informasi Medis
                  </h3>
                  
                  <div className="space-y-4">
                    {/* Primary Diagnosis */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Diagnosis Utama *
                      </label>
                      <input
                        type="text"
                        name="primaryDiagnosis"
                        value={formData.primaryDiagnosis}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${
                          errors.primaryDiagnosis ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="Contoh: Diabetes Mellitus Tipe 2"
                      />
                      {errors.primaryDiagnosis && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle size={14} className="mr-1" />
                          {errors.primaryDiagnosis}
                        </p>
                      )}
                    </div>

                    {/* Secondary Diagnosis */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Diagnosis Sekunder
                      </label>
                      <input
                        type="text"
                        name="secondaryDiagnosis"
                        value={formData.secondaryDiagnosis}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                        placeholder="Contoh: Hipertensi"
                      />
                    </div>

                    {/* Symptoms */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Gejala yang Dikeluhkan
                      </label>
                      <textarea
                        name="symptoms"
                        value={formData.symptoms}
                        onChange={handleChange}
                        rows="2"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                        placeholder="Pisahkan dengan koma, contoh: pusing, mual, demam"
                      />
                    </div>

                    {/* Allergies */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Alergi
                      </label>
                      <input
                        type="text"
                        name="allergies"
                        value={formData.allergies}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                        placeholder="Contoh: penisilin, kacang, debu"
                      />
                    </div>

                    {/* Chronic Conditions */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Penyakit Kronis
                      </label>
                      <input
                        type="text"
                        name="chronicConditions"
                        value={formData.chronicConditions}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                        placeholder="Contoh: asma, penyakit jantung"
                      />
                    </div>

                    {/* Family History */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Riwayat Keluarga
                      </label>
                      <textarea
                        name="familyHistory"
                        value={formData.familyHistory}
                        onChange={handleChange}
                        rows="2"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                        placeholder="Riwayat penyakit dalam keluarga"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Vital Signs */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <Activity size={20} className="mr-2 text-blue-600" />
                    Tanda Vital (Opsional)
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Blood Pressure */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 ">
                        <Activity size={16} className="mr-2 text-red-500" />
                        Tekanan Darah
                      </label>
                      <input
                        type="text"
                        name="vitalSigns.bloodPressure"
                        value={formData.vitalSigns.bloodPressure}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                        placeholder="Contoh: 120/80"
                      />
                    </div>

                    {/* Heart Rate */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Heart size={16} className="mr-2 text-pink-500" />
                        Detak Jantung
                      </label>
                      <input
                        type="number"
                        name="vitalSigns.heartRate"
                        value={formData.vitalSigns.heartRate}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                        placeholder="bpm"
                      />
                    </div>

                    {/* Temperature */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Thermometer size={16} className="mr-2 text-orange-500" />
                        Suhu Tubuh
                      </label>
                      <input
                        type="number"
                        name="vitalSigns.temperature"
                        value={formData.vitalSigns.temperature}
                        onChange={handleChange}
                        step="0.1"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                        placeholder="°C"
                      />
                    </div>

                    {/* Respiratory Rate */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Laju Pernapasan
                      </label>
                      <input
                        type="number"
                        name="vitalSigns.respiratoryRate"
                        value={formData.vitalSigns.respiratoryRate}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                        placeholder="/min"
                      />
                    </div>

                    {/* Oxygen Saturation */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Saturasi Oksigen
                      </label>
                      <input
                        type="number"
                        name="vitalSigns.oxygenSaturation"
                        value={formData.vitalSigns.oxygenSaturation}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                        placeholder="%"
                      />
                    </div>

                    {/* Blood Glucose */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Droplets size={16} className="mr-2 text-blue-500" />
                        Glukosa Darah
                      </label>
                      <input
                        type="number"
                        name="vitalSigns.bloodGlucose"
                        value={formData.vitalSigns.bloodGlucose}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                        placeholder="mg/dL"
                      />
                    </div>

                    {/* Weight */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Scale size={16} className="mr-2 text-indigo-500" />
                        Berat Badan
                      </label>
                      <input
                        type="number"
                        name="vitalSigns.weight"
                        value={formData.vitalSigns.weight}
                        onChange={handleChange}
                        onBlur={calculateBMI}
                        step="0.1"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                        placeholder="kg"
                      />
                    </div>

                    {/* Height */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Ruler size={16} className="mr-2 text-teal-500" />
                        Tinggi Badan
                      </label>
                      <input
                        type="number"
                        name="vitalSigns.height"
                        value={formData.vitalSigns.height}
                        onChange={handleChange}
                        onBlur={calculateBMI}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                        placeholder="cm"
                      />
                    </div>

                    {/* BMI (Calculated) */}
                    <div className="md:col-span-2">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-700">BMI (Body Mass Index)</p>
                            {formData.vitalSigns.bmi && (
                              <p className="text-2xl font-bold text-gray-800 mt-1">
                                {formData.vitalSigns.bmi} kg/m²
                              </p>
                            )}
                          </div>
                          {formData.vitalSigns.bmi && (
                            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                              parseFloat(formData.vitalSigns.bmi) < 18.5 ? 'bg-yellow-100 text-yellow-800' :
                              parseFloat(formData.vitalSigns.bmi) < 25 ? 'bg-green-100 text-green-800' :
                              parseFloat(formData.vitalSigns.bmi) < 30 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {parseFloat(formData.vitalSigns.bmi) < 18.5 ? 'Underweight' :
                               parseFloat(formData.vitalSigns.bmi) < 25 ? 'Normal' :
                               parseFloat(formData.vitalSigns.bmi) < 30 ? 'Overweight' : 'Obese'}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Review & Submit */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <CheckCircle size={20} className="mr-2 text-green-600" />
                    Review Data Pasien
                  </h3>
                  
                  <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                    {/* Personal Info Summary */}
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Data Pribadi</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-600">Nama:</span>
                          <span className="ml-2 font-medium">{formData.fullName || '-'}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Usia:</span>
                          <span className="ml-2 font-medium">{formData.age || '-'} tahun</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Jenis Kelamin:</span>
                          <span className="ml-2 font-medium">{formData.gender === 'Male' ? 'Laki-laki' : formData.gender === 'Female' ? 'Perempuan' : '-'}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Telepon:</span>
                          <span className="ml-2 font-medium">{formData.phoneNumber || '-'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Diagnosis Summary */}
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Diagnosis</h4>
                      <div className="space-y-1">
                        <p className="text-sm">
                          <span className="text-gray-600">Utama:</span>
                          <span className="ml-2 font-medium">{formData.primaryDiagnosis || '-'}</span>
                        </p>
                        {formData.secondaryDiagnosis && (
                          <p className="text-sm">
                            <span className="text-gray-600">Sekunder:</span>
                            <span className="ml-2 font-medium">{formData.secondaryDiagnosis}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Vital Signs Summary */}
                    {Object.values(formData.vitalSigns).some(value => value) && (
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">Tanda Vital</h4>
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          {formData.vitalSigns.bloodPressure && (
                            <div>
                              <span className="text-gray-600">TD:</span>
                              <span className="ml-1 font-medium">{formData.vitalSigns.bloodPressure}</span>
                            </div>
                          )}
                          {formData.vitalSigns.heartRate && (
                            <div>
                              <span className="text-gray-600">HR:</span>
                              <span className="ml-1 font-medium">{formData.vitalSigns.heartRate} bpm</span>
                            </div>
                          )}
                          {formData.vitalSigns.temperature && (
                            <div>
                              <span className="text-gray-600">Suhu:</span>
                              <span className="ml-1 font-medium">{formData.vitalSigns.temperature}°C</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Photo Upload */}
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Foto Pasien (Opsional)
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition duration-200">
                      {formData.photo ? (
                        <div className="space-y-2">
                          <img 
                            src={URL.createObjectURL(formData.photo)} 
                            alt="Preview" 
                            className="w-32 h-32 rounded-full object-cover mx-auto"
                          />
                          <p className="text-sm text-gray-600">{formData.photo.name}</p>
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, photo: null }))}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Hapus Foto
                          </button>
                        </div>
                      ) : (
                        <>
                          <Camera size={48} className="mx-auto text-gray-400 mb-2" />
                          <p className="text-gray-600 mb-2">Drag & drop foto atau</p>
                          <label className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition duration-200">
                            <Upload size={16} className="inline mr-2" />
                            Pilih Foto
                            <input
                              type="file"
                              name="photo"
                              accept="image/*"
                              onChange={handleChange}
                              className="hidden"
                            />
                          </label>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                <div className="flex items-center text-red-600">
                  <AlertCircle size={20} className="mr-2" />
                  <p>{errors.submit}</p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <div>
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition duration-200"
                  >
                    Kembali
                  </button>
                )}
              </div>
              
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition duration-200"
                >
                  Batal
                </button>
                
                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition duration-200"
                  >
                    Lanjut
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-5 py-2.5 rounded-lg font-medium transition duration-200 ${
                      isSubmitting
                        ? 'bg-blue-400 cursor-not-allowed'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Menyimpan...
                      </span>
                    ) : (
                      'Simpan Pasien'
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPatientModal;