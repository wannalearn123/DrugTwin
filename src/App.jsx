import { Route, Routes } from 'react-router'

import LandingPage from './pages/LandingPage'
import CreateAccount from './pages/CreateAccount'
import DoctorPage from './pages/DoctorPage'
import ApotekerPage from './pages/ApotekerPage'
import PasienPage from './pages/PasienPage' 

import toast from 'react-hot-toast'

const App = () => {
  return (
    <div data-theme="emerald">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/doctor" element={<DoctorPage />} />
        <Route path="/apoteker" element={<ApotekerPage />} />
        <Route path="/pasien" element={<PasienPage />} />
      </Routes>
    </div>
  )
}

export default App