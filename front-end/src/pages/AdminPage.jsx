import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import {
  Search,
  Filter,
  Shield,
  Users,
  UserCheck,
  UserX,
  Ban,
  AlertTriangle,
  Eye,
  Edit,
  Trash2,
  Plus,
  Download,
  MoreVertical,
  Clock,
  CheckCircle,
  XCircle,
  Settings,
  X,
  FileText
} from 'lucide-react';

const AdminPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeTab, setActiveTab] = useState('users');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Modal states
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState({ type: '', user: null });
  
  // Users state for real-time updates
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'Dr. Ahmad Surya',
      email: 'ahmad.surya@drugtwin.com',
      role: 'dokter',
      status: 'active',
      lastLogin: '2025-12-06 09:30',
      joinDate: '2024-08-15',
      patients: 125,
      warnings: 0,
      warningHistory: []
    },
    {
      id: 2,
      name: 'Apt. Yanti Sari',
      email: 'yanti.sari@drugtwin.com',
      role: 'apoteker',
      status: 'active',
      lastLogin: '2025-12-06 08:15',
      joinDate: '2024-09-10',
      prescriptions: 487,
      warnings: 1,
      warningHistory: [
        {
          id: 1,
          date: '2024-11-15',
          type: 'Policy Violation',
          description: 'Delayed prescription validation beyond acceptable timeframe',
          severity: 'Minor',
          issuedBy: 'System Auto-Monitor',
          status: 'Active'
        }
      ]
    },
    {
      id: 3,
      name: 'Budi Hartono',
      email: 'budi.hartono@gmail.com',
      role: 'pasien',
      status: 'restricted',
      lastLogin: '2025-12-05 16:22',
      joinDate: '2024-11-03',
      appointments: 8,
      warnings: 2,
      warningHistory: [
        {
          id: 1,
          date: '2024-11-20',
          type: 'Inappropriate Behavior',
          description: 'Reported for aggressive behavior during consultation chat',
          severity: 'Moderate',
          issuedBy: 'Admin User',
          status: 'Active'
        },
        {
          id: 2,
          date: '2024-12-01',
          type: 'Multiple Cancellations',
          description: 'Cancelled 3 appointments without proper notice in one week',
          severity: 'Minor',
          issuedBy: 'System Auto-Monitor',
          status: 'Active'
        }
      ]
    },
    {
      id: 4,
      name: 'Sarah Wijaya',
      email: 'sarah.wijaya@yahoo.com',
      role: 'pasien',
      status: 'banned',
      lastLogin: '2025-12-03 14:10',
      joinDate: '2024-10-20',
      appointments: 3,
      warnings: 5,
      warningHistory: [
        {
          id: 1,
          date: '2024-11-05',
          type: 'Spam Activity',
          description: 'Sending repetitive messages to multiple doctors',
          severity: 'Moderate',
          issuedBy: 'Dr. Ahmad Surya',
          status: 'Active'
        },
        {
          id: 2,
          date: '2024-11-12',
          type: 'Inappropriate Content',
          description: 'Sharing inappropriate images in consultation chat',
          severity: 'Major',
          issuedBy: 'Admin User',
          status: 'Active'
        },
        {
          id: 3,
          date: '2024-11-18',
          type: 'Fake Information',
          description: 'Providing false medical history information',
          severity: 'Major',
          issuedBy: 'Dr. Ahmad Surya',
          status: 'Active'
        },
        {
          id: 4,
          date: '2024-11-25',
          type: 'Harassment',
          description: 'Harassing medical staff through private messages',
          severity: 'Major',
          issuedBy: 'Admin User',
          status: 'Active'
        },
        {
          id: 5,
          date: '2024-12-02',
          type: 'Account Misuse',
          description: 'Attempting to create multiple accounts to bypass restrictions',
          severity: 'Major',
          issuedBy: 'System Security',
          status: 'Active'
        }
      ]
    },
    {
      id: 5,
      name: 'Dr. Lisa Paramitha',
      email: 'lisa.paramitha@drugtwin.com',
      role: 'dokter',
      status: 'pending',
      lastLogin: 'Never',
      joinDate: '2025-12-05',
      patients: 0,
      warnings: 0,
      warningHistory: []
    }
  ]);

  // System stats with real-time updates
  const [systemStats, setSystemStats] = useState({
    totalUsers: 2847,
    activeUsers: 2803,
    bannedUsers: 23,
    pendingApproval: 21,
    todayRegistrations: 15,
    todayLogins: 1247
  });
  
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    role: '',
    status: ''
  });

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getRoleColor = (role) => {
    switch (role) {
      case 'dokter': return 'bg-emerald-100 text-emerald-700';
      case 'apoteker': return 'bg-emerald-100 text-emerald-700';
      case 'pasien': return 'bg-emerald-100 text-emerald-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-700';
      case 'restricted': return 'bg-yellow-100 text-yellow-700';
      case 'banned': return 'bg-red-100 text-red-700';
      case 'pending': return 'bg-emerald-100 text-emerald-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };
  
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Minor': return 'bg-yellow-100 text-yellow-700';
      case 'Moderate': return 'bg-orange-100 text-orange-700';
      case 'Major': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleUserAction = (action, userId) => {
    const user = users.find(u => u.id === userId);
    setSelectedUser(user);
    
    switch (action) {
      case 'view':
        setIsViewModalOpen(true);
        break;
      case 'edit':
        setEditFormData({
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status
        });
        setIsEditModalOpen(true);
        break;
      case 'restrict':
      case 'ban':
      case 'unban':
        setConfirmAction({ type: action, user });
        setIsConfirmModalOpen(true);
        break;
      default:
        console.log(`${action} user:`, userId);
    }
  };
  
  const executeUserAction = () => {
    const { type, user } = confirmAction;
    let newStatus = user.status;
    
    switch (type) {
      case 'restrict':
        newStatus = 'restricted';
        break;
      case 'ban':
        newStatus = 'banned';
        break;
      case 'unban':
        newStatus = 'active';
        break;
    }
    
    // Update user status
    setUsers(users.map(u => u.id === user.id ? { ...u, status: newStatus } : u));
    
    // Update system stats
    setSystemStats(prev => ({
      ...prev,
      activeUsers: type === 'unban' ? prev.activeUsers + 1 : prev.activeUsers - 1,
      bannedUsers: type === 'ban' ? prev.bannedUsers + 1 : prev.bannedUsers - 1
    }));
    
    setIsConfirmModalOpen(false);
    setConfirmAction({ type: '', user: null });
  };
  
  const handleEditUser = () => {
    // Update user data
    setUsers(users.map(u => 
      u.id === selectedUser.id 
        ? { ...u, ...editFormData }
        : u
    ));
    setIsEditModalOpen(false);
  };
  
  const handleExportData = () => {
    setIsExportModalOpen(true);
  };
  
  const handleSettings = () => {
    setIsSettingsModalOpen(true);
  };
  
  const performExport = (type) => {
    // Simulate export
    const data = type === 'users' ? users : systemStats;
    console.log(`Exporting ${type}:`, data);
    
    // Create downloadable file
    const dataStr = JSON.stringify(data, null, 2);
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
              <p className="text-emerald-600">Manage users and system settings</p>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-emerald-100">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-100 p-2 rounded-lg">
                <Users className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-xl font-bold text-emerald-700">{systemStats.totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-emerald-100">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-100 p-2 rounded-lg">
                <UserCheck className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-xl font-bold text-emerald-700">{systemStats.activeUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-emerald-100">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-100 p-2 rounded-lg">
                <UserX className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Banned</p>
                <p className="text-xl font-bold text-emerald-700">{systemStats.bannedUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-emerald-100">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-100 p-2 rounded-lg">
                <Clock className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-xl font-bold text-emerald-700">{systemStats.pendingApproval}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-emerald-100">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-100 p-2 rounded-lg">
                <Plus className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">New Today</p>
                <p className="text-xl font-bold text-emerald-700">{systemStats.todayRegistrations}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-emerald-100">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-100 p-2 rounded-lg">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Logins Today</p>
                <p className="text-xl font-bold text-emerald-700">{systemStats.todayLogins}</p>
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
                User Management
              </button>
              <button
                onClick={() => setActiveTab('reports')}
                className={`px-6 py-3 font-medium border-b-2 ${
                  activeTab === 'reports'
                    ? 'border-emerald-500 text-emerald-700'
                    : 'border-transparent text-gray-500 hover:text-emerald-600'
                }`}
              >
                Reports & Analytics
              </button>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'users' && (
            <div className="p-6">
              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search users by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="restricted">Restricted</option>
                  <option value="banned">Banned</option>
                  <option value="pending">Pending</option>
                </select>
              </div>

              {/* Users Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-emerald-100">
                      <th className="text-left py-3 px-4 font-semibold text-emerald-700">User</th>
                      <th className="text-left py-3 px-4 font-semibold text-emerald-700">Role</th>
                      <th className="text-left py-3 px-4 font-semibold text-emerald-700">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-emerald-700">Last Login</th>
                      <th className="text-left py-3 px-4 font-semibold text-emerald-700">Warnings</th>
                      <th className="text-left py-3 px-4 font-semibold text-emerald-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b border-emerald-50 hover:bg-emerald-25">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-gray-900">{user.name}</p>
                            <p className="text-sm text-gray-600">{user.email}</p>
                            <p className="text-xs text-gray-500">Joined: {user.joinDate}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getRoleColor(user.role)}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(user.status)}`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-sm text-gray-700">{user.lastLogin}</p>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            {user.warnings > 0 && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
                            <span className={`text-sm ${user.warnings > 0 ? 'text-yellow-700 font-medium' : 'text-gray-600'}`}>
                              {user.warnings}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleUserAction('view', user.id)}
                              className="p-1 text-emerald-600 hover:bg-emerald-100 rounded"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleUserAction('edit', user.id)}
                              className="p-1 text-emerald-600 hover:bg-emerald-100 rounded"
                              title="Edit User"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            {user.status === 'active' && (
                              <button
                                onClick={() => handleUserAction('restrict', user.id)}
                                className="p-1 text-yellow-600 hover:bg-yellow-100 rounded"
                                title="Restrict User"
                              >
                                <AlertTriangle className="h-4 w-4" />
                              </button>
                            )}
                            {user.status !== 'banned' && (
                              <button
                                onClick={() => handleUserAction('ban', user.id)}
                                className="p-1 text-red-600 hover:bg-red-100 rounded"
                                title="Ban User"
                              >
                                <Ban className="h-4 w-4" />
                              </button>
                            )}
                            {user.status === 'banned' && (
                              <button
                                onClick={() => handleUserAction('unban', user.id)}
                                className="p-1 text-emerald-600 hover:bg-emerald-100 rounded"
                                title="Unban User"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Empty State */}
              {filteredUsers.length === 0 && (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No users found matching your search criteria.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* User Activity Report */}
                <div className="bg-emerald-50 p-6 rounded-lg border border-emerald-200">
                  <h3 className="font-semibold text-emerald-700 mb-4">User Activity</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-emerald-600">Daily Active Users</span>
                      <span className="font-medium text-emerald-700">1,247</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-emerald-600">Weekly Active Users</span>
                      <span className="font-medium text-emerald-700">2,103</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-emerald-600">Monthly Active Users</span>
                      <span className="font-medium text-emerald-700">2,654</span>
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
                    <div className="flex justify-between">
                      <span className="text-emerald-600">API Response Time</span>
                      <span className="font-medium text-emerald-700">245ms</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* View User Modal */}
      {isViewModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-emerald-200 flex-shrink-0">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-emerald-700">User Details</h2>
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <p className="text-gray-900">{selectedUser.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <p className="text-gray-900">{selectedUser.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getRoleColor(selectedUser.role)}`}>
                    {selectedUser.role}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(selectedUser.status)}`}>
                    {selectedUser.status}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Join Date</label>
                  <p className="text-gray-900">{selectedUser.joinDate}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Login</label>
                  <p className="text-gray-900">{selectedUser.lastLogin}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Warnings</label>
                  <p className={`font-medium ${selectedUser.warnings > 0 ? 'text-yellow-700' : 'text-gray-900'}`}>
                    {selectedUser.warnings}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Activity</label>
                  <p className="text-gray-900">
                    {selectedUser.patients || selectedUser.prescriptions || selectedUser.appointments || 0}
                    {selectedUser.role === 'dokter' && ' patients'}
                    {selectedUser.role === 'apoteker' && ' prescriptions'}
                    {selectedUser.role === 'pasien' && ' appointments'}
                  </p>
                </div>
              </div>
              
              {/* Warning History Section */}
              <div className="mt-6">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  Warning History ({selectedUser.warningHistory?.length || 0})
                </h4>
                
                {selectedUser.warningHistory && selectedUser.warningHistory.length > 0 ? (
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {selectedUser.warningHistory.map((warning) => (
                      <div key={warning.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(warning.severity)}`}>
                              {warning.severity}
                            </span>
                            <span className="font-medium text-gray-900">{warning.type}</span>
                          </div>
                          <span className="text-sm text-gray-500">{warning.date}</span>
                        </div>
                        
                        <p className="text-sm text-gray-700 mb-2">{warning.description}</p>
                        
                        <div className="flex justify-between items-center text-xs text-gray-600">
                          <span>Issued by: {warning.issuedBy}</span>
                          <span className={`px-2 py-1 rounded ${warning.status === 'Active' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
                            {warning.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <CheckCircle className="h-8 w-8 mx-auto mb-2 text-emerald-500" />
                    <p>No warnings issued for this user</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end flex-shrink-0">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {isEditModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
            <div className="p-6 border-b border-emerald-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-emerald-700">Edit User</h2>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={editFormData.email}
                    onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                    className="w-full px-3 py-2 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    value={editFormData.role}
                    onChange={(e) => setEditFormData({...editFormData, role: e.target.value})}
                    className="w-full px-3 py-2 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="dokter">Dokter</option>
                    <option value="apoteker">Apoteker</option>
                    <option value="pasien">Pasien</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={editFormData.status}
                    onChange={(e) => setEditFormData({...editFormData, status: e.target.value})}
                    className="w-full px-3 py-2 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="active">Active</option>
                    <option value="restricted">Restricted</option>
                    <option value="banned">Banned</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleEditUser}
                className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Action Modal */}
      {isConfirmModalOpen && confirmAction.user && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-red-100 p-2 rounded-full">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Confirm Action</h2>
              </div>
              
              <p className="text-gray-700 mb-6">
                Are you sure you want to <span className="font-semibold">{confirmAction.type}</span> user{' '}
                <span className="font-semibold">{confirmAction.user.name}</span>?
                {confirmAction.type === 'ban' && (
                  <span className="block mt-2 text-red-600 text-sm">
                    This action will prevent the user from accessing the system.
                  </span>
                )}
              </p>
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsConfirmModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={executeUserAction}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Confirm {confirmAction.type}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
                    <p className="text-sm text-gray-600">Export all user information and statistics</p>
                  </div>
                </button>
                
                <button
                  onClick={() => performExport('stats')}
                  className="w-full p-3 text-left border border-emerald-200 rounded-lg hover:bg-emerald-50 flex items-center gap-3"
                >
                  <FileText className="h-5 w-5 text-emerald-600" />
                  <div>
                    <p className="font-medium text-gray-900">System Statistics</p>
                    <p className="text-sm text-gray-600">Export system performance and usage data</p>
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
                  <div className="flex items-center gap-3">
                    <span className="text-gray-700">Session timeout (minutes):</span>
                    <input 
                      type="number" 
                      defaultValue="60" 
                      className="w-20 px-2 py-1 border border-emerald-200 rounded focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-emerald-700 mb-4">Notifications</h3>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="text-emerald-600 focus:ring-emerald-500" />
                    <span className="ml-2 text-gray-700">Email alerts for system issues</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="text-emerald-600 focus:ring-emerald-500" />
                    <span className="ml-2 text-gray-700">Daily activity reports</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="text-emerald-600 focus:ring-emerald-500" />
                    <span className="ml-2 text-gray-700">User behavior alerts</span>
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