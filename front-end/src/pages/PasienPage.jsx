import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import { Clock, MessageSquare } from 'lucide-react'
import ScheduleConsultationModal from '../components/ScheduleConsultationModal'
import ReportSideEffectModal from '../components/ReportSideEffectModal'
import MedicalHistoryModal from '../components/MedicalHistoryModal'
import ChatbotModal from '../components/ChatbotModal'

const therapySchedule = [
  { time: '08:00', name: 'Amoxylin', detail: '3 obat', status: 'Diminum' },
  { time: '12:00', name: 'Pharacetamol', detail: '2 obat', status: 'Diminum' },
  { time: '18:00', name: 'Ibuprofen', detail: '4 obat', status: 'Belum' },
]

const activeMedications = [
  { name: 'Paracetamol - 10mg', frequency: '3 times a day' },
  { name: 'Amoxicillin - 500mg', frequency: '2 times a day' },
  { name: 'Ibuprofen - 200mg', frequency: '1 capsul' },
]

const PasienPage = () => {
  const adherence = 85
  const onTime = 25
  const target = 30

  // Modal states
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)
  const [showHistoryModal, setShowHistoryModal] = useState(false)
  const [showChatModal, setShowChatModal] = useState(false)

  // Modal handlers
  const handleScheduleSubmit = (formData) => {
    console.log('Schedule consultation:', formData)
    // Handle form submission
  }

  const handleReportSubmit = (formData) => {
    console.log('Report side effect:', formData)
    // Handle form submission
  }

  return (
    <div className='min-h-screen bg-patient'>
      <Navbar />

      <main className='max-w-7xl mx-auto px-6 py-8'>
        <h1 className='text-2xl font-bold text-slate-800 mb-8'>Dashboard Pasien</h1>

        {/* Layout sesuai gambar: 3 kolom */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          
          {/* Kolom 1: Tingkat Kepatuhan */}
          <div className='patient-card space-y-6'>
            {/* Section: Tingkat Kepatuhan */}
            <div>
              <h2 className='text-sm font-semibold text-slate-600 mb-4'>Tingkat Kepatuhan</h2>
              
              <div className='text-center mb-6'>
                <p className='text-6xl font-bold text-emerald-500 mb-2'>{adherence}%</p>
                <p className='text-sm text-slate-500'>30 Hari Terakhir</p>
              </div>

              <div>
                <div className='progress-info-box'>
                  <span className='label'>Obat diminum tepat waktu</span>
                  <span className='value'>{onTime}/{target}</span>
                </div>
                <div className='h-3 w-full rounded-full bg-slate-200 overflow-hidden'>
                  <div 
                    className='h-full bg-gradient-to-r from-emerald-400 to-emerald-500' 
                    style={{ width: `${(onTime / target) * 100}%` }} 
                  />
                </div>
                <p className='progress-day-label'>hari</p>
              </div>
            </div>

            {/* Section: Obat Aktif */}
            <div className='border-t pt-4'>
              <h3 className='text-sm font-semibold text-slate-600 mb-3'>Obat Aktif</h3>
              <ul className='space-y-3'>
                {activeMedications.map((med, idx) => (
                  <li key={idx} className='active-med-item'>
                    <p className='font-medium text-sm'>{med.name}</p>
                    <p className='text-xs text-slate-500'>{med.frequency}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Kolom 2: Jadwal Terapi */}
          <div className='patient-card h-fit'>
            {/* Section: Jadwal Terapi */}
            <div>
              <h2 className='text-sm font-semibold text-slate-600 mb-4'>Jadwal Terapi</h2>
              
              <div className='space-y-3'>
                {therapySchedule.map((session, idx) => (
                  <div key={idx} className={`therapy-schedule-item ${
                    session.status !== 'Diminum' ? 'therapy-schedule-item--pending' : ''
                  }`}>
                    <div className='flex items-center gap-3'>
                      <div className='time-badge'>
                        <Clock size={16} className='text-emerald-600' />
                        <span className='font-semibold text-sm'>{session.time}</span>
                      </div>
                      <div className='flex-1'>
                        <p className='font-bold text-base'>{session.name}</p>
                        <p className='text-sm text-slate-500'>{session.detail}</p>
                      </div>
                    </div>
                    <span className={`status-badge ${
                      session.status === 'Diminum' 
                        ? 'status-badge--done' 
                        : 'status-badge--pending'
                    }`}>
                      {session.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Kolom 3: Fast Action & Tanya AI */}
          <div className='space-y-6'>
            
            {/* Section: Fast Action */}
            <div className='patient-card'>
              <div>
                <h2 className='text-sm font-semibold text-slate-600 mb-4'>Fast Action</h2>
                
                <div className='space-y-3'>
                  <button 
                    type='button' 
                    className='fast-action-btn'
                    onClick={() => setShowScheduleModal(true)}
                  >
                    Jadwalkan Konsultasi
                  </button>
                  <button 
                    type='button' 
                    className='fast-action-btn'
                    onClick={() => setShowReportModal(true)}
                  >
                    Laporkan efek samping
                  </button>
                  <button 
                    type='button' 
                    className='fast-action-btn'
                    onClick={() => setShowHistoryModal(true)}
                  >
                    Lihat Riwayat Kesehatan
                  </button>
                </div>
              </div>
            </div>

            {/* Section: Tanya AI */}
            <div className='patient-card'>
              <div>
                <p className='text-sm font-semibold text-slate-800 mb-2'>Tanya AI 🤖</p>
                <p className='text-sm text-slate-600 mb-4'>
                  Ada pertanyaan tentang obat atau teraphy?<br />
                  Tanyakan IP kami
                </p>
                <button 
                  type='button' 
                  className='ai-chat-btn-simple'
                  onClick={() => setShowChatModal(true)}
                >
                  Mulai Chat
                </button>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Modals */}
      <ScheduleConsultationModal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        onSubmit={handleScheduleSubmit}
      />
      
      <ReportSideEffectModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        onSubmit={handleReportSubmit}
      />
      
      <MedicalHistoryModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
      />
      
      <ChatbotModal
        isOpen={showChatModal}
        onClose={() => setShowChatModal(false)}
      />
    </div>
  )
}

export default PasienPage