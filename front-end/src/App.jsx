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


const qc = new QueryClient({ 
  defaultOptions: { 
    queries: { 
      refetchOnWindowFocus: false, 
      retry: 1 
    } 
  } 
});

function App() {
  return (
    <QueryClientProvider client={qc}>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          {/* Admin Routes */}
          <Route path="/admin/users" element={<PrivateRoute roles={['admin']}><UserManagement /></PrivateRoute>} />
          <Route path="/admin/users/new" element={<PrivateRoute roles={['admin']}><UserForm /></PrivateRoute>} />

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
          
          <Route path="*" element={<LoginPage />} />
        </Routes>
        <Toaster />
        <ReactQueryDevtools />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;