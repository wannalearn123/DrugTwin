import { useState } from 'react';
import { useUsers, useDeleteUser, useToggleUserStatus } from '../hooks/useUsers';
import { Link } from 'react-router';
import { Search, UserPlus, Edit, Trash2, UserCheck, UserX, CheckCircle, XCircle } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';

const UserManagement = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  const { data, isLoading, error } = useUsers({ 
    page, 
    limit: 10, 
    search,
    role: roleFilter,
    isActive: statusFilter,
  });
  
  const deleteMut = useDeleteUser();
  const toggleMut = useToggleUserStatus();

  const handleDelete = (id, email) => {
    if (confirm(`Delete user ${email}?`)) {
      deleteMut.mutate(id);
    }
  };

  const handleToggleStatus = (id, name, currentStatus) => {
    const action = currentStatus ? 'deactivate' : 'activate';
    if (confirm(`${action.charAt(0).toUpperCase() + action.slice(1)} user ${name}?`)) {
      toggleMut.mutate(id);
    }
  };

  // Debug: Check what data we're getting
  console.log('User data:', data);
  console.log('Is loading:', isLoading);
  console.log('Error:', error);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-96">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="alert alert-error">
          <span>Error loading users: {error.message}</span>
        </div>
      </DashboardLayout>
    );
  }

  const { users = [], total = 0, totalPages = 1 } = data?.data || {};

  // ❌ REMOVE THIS - API already handles search
  // const filtered = users.filter(u => 
  //   !search || u.name.toLowerCase().includes(search.toLowerCase())
  // );

  const getRoleBadgeClass = (role) => {
    const classes = {
      admin: 'badge-error',
      doctor: 'badge-info',
      patient: 'badge-success',
      pharmacist: 'badge-warning',
    };
    return classes[role] || 'badge-ghost';
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">User Management</h1>
            <p className="text-gray-600">Manage all registered users</p>
          </div>
          <Link to="/admin/users/new" className="btn btn-primary gap-2">
            <UserPlus className="w-5 h-5" /> Add User
          </Link>
        </div>

        {/* Stats */}
        <div className="stats shadow mb-6 w-full">
          <div className="stat">
            <div className="stat-title">Total Users</div>
            <div className="stat-value text-primary">{total}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              className="input input-bordered w-full pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="select select-bordered"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="doctor">Doctor</option>
            <option value="patient">Patient</option>
            <option value="pharmacist">Pharmacist</option>
          </select>

          <select
            className="select select-bordered"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-white shadow-xl rounded-lg">
          <table className="table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Status</th>
                <th>Profile</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-500">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id} className="hover">
                    <td>
                      <div className="font-semibold">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </td>
                    <td>
                      <span className={`badge ${getRoleBadgeClass(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <span className={`badge gap-2 ${user.isActive ? 'badge-success' : 'badge-error'}`}>
                        {user.isActive ? (
                          <>
                            <CheckCircle className="w-3 h-3" />
                            Active
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" />
                            Inactive
                          </>
                        )}
                      </span>
                    </td>
                    <td>
                      {user.hasProfile ? (
                        <span className="badge badge-success gap-2">
                          <CheckCircle className="w-3 h-3" />
                          Complete
                        </span>
                      ) : (
                        <span className="badge badge-warning gap-2">
                          <XCircle className="w-3 h-3" />
                          Incomplete
                        </span>
                      )}
                    </td>
                    <td>
                      {user.lastLogin ? (
                        <span className="text-sm">
                          {new Date(user.lastLogin).toLocaleDateString()}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">Never</span>
                      )}
                    </td>
                    <td className="flex gap-2">
                      <Link
                        to={`/admin/users/${user._id}/edit`}
                        className="btn btn-ghost btn-sm"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleToggleStatus(user._id, user.name, user.isActive)}
                        className={`btn btn-ghost btn-sm ${user.isActive ? 'text-warning' : 'text-success'}`}
                        title={user.isActive ? 'Deactivate' : 'Activate'}
                        disabled={toggleMut.isLoading}
                      >
                        {user.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleDelete(user._id, user.email)}
                        className="btn btn-ghost btn-sm text-error"
                        title="Delete"
                        disabled={deleteMut.isLoading}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <div className="join">
              <button
                className="join-item btn"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </button>
              <button className="join-item btn btn-active">
                Page {page} of {totalPages}
              </button>
              <button
                className="join-item btn"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default UserManagement;