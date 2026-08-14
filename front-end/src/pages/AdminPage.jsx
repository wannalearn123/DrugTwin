import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import UserManagementTab from '../components/UserManagementTab';
import PatientManagementTab from '../components/PatientManagementTab';
import DoctorManagementTab from '../components/DoctorManagementTab';
import { useUsers } from '../hooks/useUsers';
import { usePatients } from '../hooks/usePatients';
import { useDoctors } from '../hooks/useDoctor';
import {
  Users,
  UserCheck,
  UserX,
  Download,
  Settings,
  FileText,
  X,
  Stethoscope,
  Heart
} from 'lucide-react';

const AdminPage = () => {
  // ===== STATE =====
  const [activeTab, setActiveTab] = useState('users');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // ===== HOOKS =====
  const { data: usersData } = useUsers({ page: 1, limit: 1000 });
  const { data: patientsData } = usePatients({ page: 1, limit: 1000 });
  const { data: doctorsData } = useDoctors({ page: 1, limit: 1000 });

  // ===== EXTRACT DATA =====
  const users = usersData?.data?.users || [];
  const patients = patientsData?.data?.patients || [];
  const doctors = doctorsData?.data?.doctors || [];
  
  const totalUsers = usersData?.data?.total || 0;
  const totalPatients = patientsData?.data?.total || 0;
  const totalDoctors = doctorsData?.data?.total || 0;
  
  const activeUsersCount = users.filter(u => u.isActive).length;
  const inactiveUsersCount = users.filter(u => !u.isActive).length;

  // ===== HANDLERS =====
  const handleExportData = () => {
    setIsExportModalOpen(true);
  };
  
  const handleSettings = () => {
    setIsSettingsModalOpen(true);
  };
  
  const performExport = (type) => {
    let exportData;
    switch(type) {
      case 'users':
        exportData = users;
        break;
      case 'patients':
        exportData = patients;
        break;
      case 'doctors':
        exportData = doctors;
        break;
      case 'stats':
        exportData = { 
          totalUsers, 
          totalPatients, 
          totalDoctors,
          activeUsersCount, 
          inactiveUsersCount 
        };
        break;
      default:
        exportData = {};
    }
    
    console.log(`Exporting ${type}:`, exportData);
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `${type}_export_${new Date().toISOString().split('T')[0]}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    setIsExportModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-emerald-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h1 className="text-2xl font-bold text-emerald-700">System Administration</h1>
              <p className="text-emerald-600">Manage users, patients, and doctors</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={handleExportData}
                className="px-4 py-2 bg-emerald-500 text-white font-medium rounded-lg hover:bg-emerald-600 flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export Data
              </button>
              <button 
                onClick={handleSettings}
                className="px-4 py-2 bg-emerald-500 text-white font-medium rounded-lg hover:bg-emerald-600 flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                Settings
              </button>
            </div>
          </div>
        </div>

        {/* System Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-emerald-100">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-100 p-2 rounded-lg">
                <Users className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-xl font-bold text-emerald-700">{totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-emerald-100">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Stethoscope className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Doctors</p>
                <p className="text-xl font-bold text-blue-700">{totalDoctors}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-emerald-100">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Heart className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Patients</p>
                <p className="text-xl font-bold text-purple-700">{totalPatients}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-emerald-100">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-100 p-2 rounded-lg">
                <UserCheck className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Users</p>
                <p className="text-xl font-bold text-emerald-700">{activeUsersCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border border-emerald-100">
          {/* Tabs */}
          <div className="border-b border-emerald-100">
            <div className="flex">
              <button
                onClick={() => setActiveTab('users')}
                className={`px-6 py-3 font-medium border-b-2 ${
                  activeTab === 'users'
                    ? 'border-emerald-500 text-emerald-700'
                    : 'border-transparent text-gray-500 hover:text-emerald-600'
                }`}
              >
                <Users className="inline-block h-4 w-4 mr-2" />
                Users
              </button>
              <button
                onClick={() => setActiveTab('doctors')}
                className={`px-6 py-3 font-medium border-b-2 ${
                  activeTab === 'doctors'
                    ? 'border-emerald-500 text-emerald-700'
                    : 'border-transparent text-gray-500 hover:text-emerald-600'
                }`}
              >
                <Stethoscope className="inline-block h-4 w-4 mr-2" />
                Doctors
              </button>
              <button
                onClick={() => setActiveTab('patients')}
                className={`px-6 py-3 font-medium border-b-2 ${
                  activeTab === 'patients'
                    ? 'border-emerald-500 text-emerald-700'
                    : 'border-transparent text-gray-500 hover:text-emerald-600'
                }`}
              >
                <Heart className="inline-block h-4 w-4 mr-2" />
                Patients
              </button>
              <button
                onClick={() => setActiveTab('reports')}
                className={`px-6 py-3 font-medium border-b-2 ${
                  activeTab === 'reports'
                    ? 'border-emerald-500 text-emerald-700'
                    : 'border-transparent text-gray-500 hover:text-emerald-600'
                }`}
              >
                <FileText className="inline-block h-4 w-4 mr-2" />
                Reports
              </button>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'users' && <UserManagementTab />}
          {activeTab === 'doctors' && <DoctorManagementTab />}
          {activeTab === 'patients' && <PatientManagementTab />}

          {activeTab === 'reports' && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* User Statistics */}
                <div className="bg-emerald-50 p-6 rounded-lg border border-emerald-200">
                  <h3 className="font-semibold text-emerald-700 mb-4">User Statistics</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-emerald-600">Total Users</span>
                      <span className="font-medium text-emerald-700">{totalUsers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-emerald-600">Active Users</span>
                      <span className="font-medium text-emerald-700">{activeUsersCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-emerald-600">Inactive Users</span>
                      <span className="font-medium text-emerald-700">{inactiveUsersCount}</span>
                    </div>
                  </div>
                </div>

                {/* Medical Staff Statistics */}
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-blue-700 mb-4">Medical Staff</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-blue-600">Total Doctors</span>
                      <span className="font-medium text-blue-700">{totalDoctors}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-600">Total Patients</span>
                      <span className="font-medium text-blue-700">{totalPatients}</span>
                    </div>
                  </div>
                </div>

                {/* System Health */}
                <div className="bg-emerald-50 p-6 rounded-lg border border-emerald-200">
                  <h3 className="font-semibold text-emerald-700 mb-4">System Health</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-emerald-600">Server Status</span>
                      <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-sm">Online</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-emerald-600">Database Status</span>
                      <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-sm">Normal</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Export Data Modal */}
      {isExportModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-emerald-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-emerald-700">Export Data</h2>
                <button
                  onClick={() => setIsExportModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <p className="text-gray-700 mb-4">Choose what data you want to export:</p>
              
              <div className="space-y-3">
                <button
                  onClick={() => performExport('users')}
                  className="w-full p-3 text-left border border-emerald-200 rounded-lg hover:bg-emerald-50 flex items-center gap-3"
                >
                  <Users className="h-5 w-5 text-emerald-600" />
                  <div>
                    <p className="font-medium text-gray-900">User Data</p>
                    <p className="text-sm text-gray-600">Export all user information</p>
                  </div>
                </button>

                <button
                  onClick={() => performExport('doctors')}
                  className="w-full p-3 text-left border border-blue-200 rounded-lg hover:bg-blue-50 flex items-center gap-3"
                >
                  <Stethoscope className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">Doctor Data</p>
                    <p className="text-sm text-gray-600">Export all doctor information</p>
                  </div>
                </button>

                <button
                  onClick={() => performExport('patients')}
                  className="w-full p-3 text-left border border-purple-200 rounded-lg hover:bg-purple-50 flex items-center gap-3"
                >
                  <Heart className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-medium text-gray-900">Patient Data</p>
                    <p className="text-sm text-gray-600">Export all patient information</p>
                  </div>
                </button>
                
                <button
                  onClick={() => performExport('stats')}
                  className="w-full p-3 text-left border border-emerald-200 rounded-lg hover:bg-emerald-50 flex items-center gap-3"
                >
                  <FileText className="h-5 w-5 text-emerald-600" />
                  <div>
                    <p className="font-medium text-gray-900">System Statistics</p>
                    <p className="text-sm text-gray-600">Export system statistics</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {isSettingsModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-emerald-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-emerald-700">System Settings</h2>
                <button
                  onClick={() => setIsSettingsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <h3 className="font-semibold text-emerald-700 mb-4">User Management</h3>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="text-emerald-600 focus:ring-emerald-500" />
                    <span className="ml-2 text-gray-700">Auto-approve new doctor registrations</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="text-emerald-600 focus:ring-emerald-500" />
                    <span className="ml-2 text-gray-700">Require email verification for new users</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="text-emerald-600 focus:ring-emerald-500" />
                    <span className="ml-2 text-gray-700">Send notification emails for user actions</span>
                  </label>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-emerald-700 mb-4">Security</h3>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="text-emerald-600 focus:ring-emerald-500" />
                    <span className="ml-2 text-gray-700">Enable two-factor authentication</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="text-emerald-600 focus:ring-emerald-500" />
                    <span className="ml-2 text-gray-700">Log all admin actions</span>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setIsSettingsModalOpen(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  console.log('Settings saved');
                  setIsSettingsModalOpen(false);
                }}
                className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;