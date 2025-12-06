import { Route, Routes } from 'react-router'
import './App.css'

import LandingPage from './pages/LandingPage'
import CreateAccount from './pages/CreateAccount'
import DoctorPage from './pages/DoctorPage'
import ApotekerPage from './pages/ApotekerPage'
import PasienPage from './pages/PasienPage'
import AdminPage from './pages/AdminPage'
import LoginPage from './pages/LoginPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'

import toast from 'react-hot-toast'

const App = () => {
  return (
    <div data-theme="emerald">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/doctor" element={<DoctorPage />} />
        <Route path="/apoteker" element={<ApotekerPage />} />
        <Route path="/pasien" element={<PasienPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Routes>
    </div>
  )
}

export default App