import { useState } from 'react';
import { usePatients, useRemovePatient } from '../hooks/usePatients';
import { Link } from 'react-router';
import { Search, UserPlus, Edit, Trash2, Eye } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';

const PatientDashboard = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data, isLoading } = usePatients({ page, limit: 10 });
  const removeMut = useRemovePatient();

  const handleDelete = (id, name) => {
    if (confirm(`Remove patient ${name}?`)) removeMut.mutate(id);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-96">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </DashboardLayout>
    );
  }

  const { patients = [], total = 0, totalPages = 1 } = data?.data || {};
  const filtered = patients.filter(p => 
    !search || p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Patient Management</h1>
            <p className="text-gray-600">Manage all patients in the system</p>
          </div>
          <Link to="/admin/patients/new" className="btn btn-primary gap-2">
            <UserPlus className="w-5 h-5" /> Add Patient
          </Link>
        </div>

        {/* Stats */}
        <div className="stats shadow mb-6 w-full">
          <div className="stat">
            <div className="stat-title">Total Patients</div>
            <div className="stat-value text-primary">{total}</div>
            <div className="stat-desc">All registered patients</div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search patients by name..."
            className="input input-bordered w-full pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-white shadow-xl rounded-lg">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>DOB</th>
                <th>Phone</th>
                <th>Blood Type</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-500">
                    {search ? 'No patients found' : 'No patients added yet'}
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p._id} className="hover">
                    <td>
                      <div className="font-semibold">{p.userId?.name}</div>
                      <div className="text-sm text-gray-500">{p.userId?.email}</div>
                    </td>
                    <td>{new Date(p.dateOfBirth).toLocaleDateString()}</td>
                    <td>{p.phone}</td>
                    <td>
                      <span className="badge badge-ghost">
                        {p.bloodType || 'N/A'}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${p.isActive ? 'badge-success' : 'badge-error'}`}>
                        {p.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="flex gap-2">
                      <Link
                        to={`/admin/patients/${p._id}`}
                        className="btn btn-ghost btn-sm"
                        title="View"
                      >
                        <Eye className="size-4" />
                      </Link>
                      <Link
                        to={`/admin/patients/${p._id}/edit`}
                        className="btn btn-ghost btn-sm"
                        title="Edit"
                      >
                        <Edit className="size-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(p._id, p.name)}
                        className="btn btn-ghost btn-sm text-error"
                        title="Delete"
                        disabled={removeMut.isLoading}
                      >
                        <Trash2 className="size-4" />
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
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </button>
              <button className="join-item btn btn-active">
                Page {page} of {totalPages}
              </button>
              <button
                className="join-item btn"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
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

export default PatientDashboard;