import React from 'react'
import BackButton from './BackButton.jsx'
import ClinicHistory from './Patient/ClinicHistory.jsx'

const InfoPatient = () => {
  return (
    <div className='bg-base-100 border-base-content/10'>
        <div className='mx-auto max-w-6xl py-2'>
        <BackButton title="Patient Info" location="patient" />
        <ClinicHistory />
        </div>
    </div>
  )
}

export default InfoPatient