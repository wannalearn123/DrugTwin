<<<<<<< HEAD
import { Routes, Route } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { PrivateRoute } from './routes/PrivateRoute';
import LoginPage from './pages/LoginPage';
import PatientDashboard from './pages/PatientDashboard';
import PatientForm from './pages/PatientForm';
import PatientDetail from './pages/PatientDetail';
import AssignDoctor from './pages/AssignDoctor';
import DoctorManagement from './pages/DoctorManagement';
import DoctorForm from './pages/DoctorForm';
import DoctorDetail from './pages/DoctorDetail';
import DoctorDashboard from './pages/DoctorDashboard';
import CheckupForm from './pages/CheckupForm';
import UserForm from './pages/UserForm';
import UserManagement from './pages/UserManagement';
import LandingPage from './pages/LandingPage';
import AdminPage from './pages/AdminPage';
=======
import { Route, Routes } from 'react-router'
import './App.css'
>>>>>>> cb1138f80c16598bf8c2f417b5823734601c1996

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
<<<<<<< HEAD
    <QueryClientProvider client={qc}>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<PrivateRoute roles={['admin']}><AdminPage /></PrivateRoute>} />
          {/* <Route path="/admin/users" element={<PrivateRoute roles={['admin']}><UserManagement /></PrivateRoute>} /> */}
          <Route path="/admin/users/new" element={<PrivateRoute roles={['admin']}><UserForm /></PrivateRoute>} />
          <Route path="/admin/users/:id/edit" element={<PrivateRoute roles={['admin']}><UserForm /></PrivateRoute>} />

          <Route path="/admin/patients" element={<PrivateRoute roles={['admin']}><PatientDashboard /></PrivateRoute>} />
          <Route path="/admin/patients/new" element={<PrivateRoute roles={['admin']}><PatientForm /></PrivateRoute>} />
          <Route path="/admin/patients/:id" element={<PrivateRoute roles={['admin']}><PatientDetail /></PrivateRoute>} />
          <Route path="/admin/patients/:id/edit" element={<PrivateRoute roles={['admin']}><PatientForm /></PrivateRoute>} />
          <Route path="/admin/patients/:id/assign-doctor" element={<PrivateRoute roles={['admin']}><AssignDoctor /></PrivateRoute>} />
          
          <Route path="/admin/doctors" element={<PrivateRoute roles={['admin']}><DoctorManagement /></PrivateRoute>} />
          <Route path="/admin/doctors/new" element={<PrivateRoute roles={['admin']}><DoctorForm /></PrivateRoute>} />
          <Route path="/admin/doctors/:id" element={<PrivateRoute roles={['admin']}><DoctorDetail /></PrivateRoute>} />
          <Route path="/admin/doctors/:id/edit" element={<PrivateRoute roles={['admin']}><DoctorForm /></PrivateRoute>} />
          
          {/* Doctor Routes */}
          <Route path="/doctor/dashboard" element={<PrivateRoute roles={['doctor']}><DoctorDashboard /></PrivateRoute>} />
          <Route path="/doctor/checkup/:patientId" element={<PrivateRoute roles={['doctor']}><CheckupForm /></PrivateRoute>} />
          
          <Route path="*" element={<LandingPage  />} />
        </Routes>
        <Toaster />
        <ReactQueryDevtools />
      </AuthProvider>
    </QueryClientProvider>
  );
=======
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
>>>>>>> cb1138f80c16598bf8c2f417b5823734601c1996
}

export default App