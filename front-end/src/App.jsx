import React from 'react'
import { Routes, Route } from 'react-router'
import HomePage from './pages/HomePage'
import DoctorPage from './pages/DoctorPage'
import PharmacistPage from './pages/PharmacistPage'
import PatientPage from './pages/PatientPage'
import AdminPage from './pages/AdminPage'
import RolePage from './pages/RolePage'

const App = () => {
  return (
    <div data-theme="emerald">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/doctor" element={<DoctorPage />} />
        <Route path="/pharmacist" element={<PharmacistPage />} />
        <Route path="/patient" element={<PatientPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/role" element={<RolePage />} />
      </Routes>
    </div>
  )
}

export default App