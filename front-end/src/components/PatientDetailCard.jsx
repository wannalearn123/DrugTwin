import React from 'react';
import {
  User,
  Calendar,
  Activity,
  Heart,
  Pill,
  AlertTriangle,
  MessageCircle,
  ChevronRight,
  Clock,
  FileText,
  Stethoscope,
  Droplets,
  Thermometer
} from 'lucide-react';

const PatientDetailCard = ({ 
  patient,
  onFollowUp,
  onMessage,
  onViewDetail,
  compact = false 
}) => {
  if (!patient) return null;

  return (
    <div className={`bg-white rounded-xl shadow-lg border border-gray-200 ${!compact && 'p-6'}`}>
      {/* Header - Patient Info */}
      <div className="mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
              <User size={28} className="text-emerald-600" />
            </div>
            
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <h2 className="text-2xl font-bold text-gray-800">{patient.name}</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  patient.status === 'active' 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : patient.status === 'follow-up'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {patient.status === 'active' ? 'Aktif' : 'Follow-up'}
                </span>
              </div>
              
              <div className="flex flex-wrap items-center gap-4 text-gray-600">
                <div className="flex items-center">
                  <FileText size={16} className="mr-2" />
                  <span className="font-medium">ID:</span>
                  <span className="ml-1">{patient.patientId}</span>
                </div>
                <div className="flex items-center">
                  <Calendar size={16} className="mr-2" />
                  <span>{patient.age} tahun</span>
                </div>
                <div className="flex items-center">
                  <User size={16} className="mr-2" />
                  <span>{patient.gender}</span>
                </div>
                {patient.lastVisit && (
                  <div className="flex items-center">
                    <Clock size={16} className="mr-2" />
                    <span>Terakhir: {patient.lastVisit}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {onViewDetail && (
            <button
              onClick={onViewDetail}
              className="text-emerald-600 hover:text-emerald-800 p-2 rounded-lg hover:bg-emerald-50 transition duration-200"
            >
              <ChevronRight size={24} />
            </button>
          )}
        </div>
      </div>

      {/* Diagnosis Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
          <Stethoscope size={20} className="mr-2 text-emerald-600" />
          Diagnosis:
        </h3>
        <div className="bg-emerald-50 rounded-lg p-4">
          <p className="text-gray-800 font-medium mb-3">{patient.diagnosis}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {patient.vitalSigns?.bloodPressure && (
              <div className="flex items-center">
                <Activity size={20} className="mr-3 text-red-500" />
                <div>
                  <p className="text-sm text-gray-600">Tekanan Darah</p>
                  <p className="font-semibold text-gray-800">{patient.vitalSigns.bloodPressure}</p>
                </div>
              </div>
            )}
            
            {patient.vitalSigns?.heartRate && (
              <div className="flex items-center">
                <Heart size={20} className="mr-3 text-pink-500" />
                <div>
                  <p className="text-sm text-gray-600">Detak Jantung</p>
                  <p className="font-semibold text-gray-800">{patient.vitalSigns.heartRate} bpm</p>
                </div>
              </div>
            )}
            
            {patient.vitalSigns?.temperature && (
              <div className="flex items-center">
                <Thermometer size={20} className="mr-3 text-orange-500" />
                <div>
                  <p className="text-sm text-gray-600">Suhu Tubuh</p>
                  <p className="font-semibold text-gray-800">{patient.vitalSigns.temperature}°C</p>
                </div>
              </div>
            )}
            
            {patient.vitalSigns?.glucose && (
              <div className="flex items-center">
                <Droplets size={20} className="mr-3 text-emerald-500" />
                <div>
                  <p className="text-sm text-gray-600">Glukosa Darah</p>
                  <p className="font-semibold text-gray-800">{patient.vitalSigns.glucose} mg/dL</p>
                </div>
              </div>
            )}
            
            {patient.vitalSigns?.hba1c && (
              <div className="flex items-center">
                <Activity size={20} className="mr-3 text-emerald-500" />
                <div>
                  <p className="text-sm text-gray-600">HbA1c</p>
                  <p className="font-semibold text-gray-800">{patient.vitalSigns.hba1c}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Regimen Terapi Section */}
      {patient.medications && patient.medications.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
            <Pill size={20} className="mr-2 text-emerald-600" />
            Regimen Terapi:
          </h3>
          <div className="bg-emerald-50 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {patient.medications.map((med, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-lg p-3 border border-emerald-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <Pill size={16} className="mr-2 text-emerald-600" />
                      <span className="font-medium text-gray-800">{med.name}</span>
                    </div>
                    {med.status && (
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        med.status === 'active' 
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {med.status === 'active' ? 'Aktif' : 'Non-aktif'}
                      </span>
                    )}
                  </div>
                  {med.dosage && (
                    <p className="text-sm text-gray-600">Dosis: {med.dosage}</p>
                  )}
                  {med.amount && (
                    <p className="text-sm text-gray-600">Jumlah: {med.amount}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* AI Recommendations Section */}
      {patient.aiRecommendations && patient.aiRecommendations.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
            <AlertTriangle size={20} className="mr-2 text-yellow-600" />
            Rekomendasi AI:
          </h3>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <ul className="space-y-3">
              {patient.aiRecommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start">
                  <AlertTriangle size={18} className="mr-3 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-800">{recommendation}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
        {onFollowUp && (
          <button
            onClick={onFollowUp}
            className="px-5 py-2.5 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition duration-200 flex items-center"
          >
            <Clock size={18} className="mr-2" />
            Follow-up
          </button>
        )}
        
        {onMessage && (
          <button
            onClick={onMessage}
            className="px-5 py-2.5 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition duration-200 flex items-center"
          >
            <MessageCircle size={18} className="mr-2" />
            Pesan
          </button>
        )}
        
        {patient.id && (
          <button className="px-5 py-2.5 bg-gray-100 text-gray-800 rounded-lg font-medium hover:bg-gray-200 transition duration-200">
            Lihat Detail Lengkap
          </button>
        )}
        
        {patient.id && (
          <button className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition duration-200">
            EMR
          </button>
        )}
      </div>
    </div>
  );
};

export default PatientDetailCard;
