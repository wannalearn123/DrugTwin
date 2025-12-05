import { useState } from 'react';
import { useDoctors, useDeleteDoctor } from '../hooks/useDoctor';
import { Link } from 'react-router';
import { Search, UserPlus, Edit, Trash2, Eye } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';

const DoctorManagement = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data, isLoading } = useDoctors({ page, limit: 10 });
  const deleteMut = useDeleteDoctor();

  const handleDelete = (id, name) => {
    if (confirm(`Delete doctor ${name}?`)) deleteMut.mutate(id);
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

  const { doctors = [], total = 0, totalPages = 1 } = data?.data || {};
  const filtered = doctors.filter(d => 
    !search || d.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Doctor Management</h1>
            <p className="text-gray-600">Manage all doctors in the system</p>
          </div>
          <Link to="/admin/doctors/new" className="btn btn-primary gap-2">
            <UserPlus className="w-5 h-5" /> Add Doctor
          </Link>
        </div>

        {/* Stats */}
        <div className="stats shadow mb-6 w-full">
          <div className="stat">
            <div className="stat-title">Total Doctors</div>
            <div className="stat-value text-primary">{total}</div>
            <div className="stat-desc">All registered doctors</div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search doctors by name..."
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
                <th>Specialization</th>
                <th>License</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-500">
                    No doctors found
                  </td>
                </tr>
              ) : (
                filtered.map((d) => (
                  <tr key={d._id} className="hover">
                    <td>
                      <div className="font-semibold">{d.userId?.name}</div>
                      <div className="text-sm text-gray-500">{d.userId?.email}</div>
                    </td>
                    <td>
                      <span className="">{d.specialties.join(', ')}</span>
                    </td>
                    <td>{d.licenseNumber}</td>
                    <td>{d.userId?.phone}</td>
                    <td>
                      <span className={`badge ${d.isActive ? 'badge-success' : 'badge-error'}`}>
                        {d.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="flex gap-2">
                      <Link
                        to={`/admin/doctors/${d._id}`}
                        className="btn btn-ghost btn-sm"
                        title="Edit"
                      >
                        <Eye className="size-4" />
                      </Link>
                      <Link
                        to={`/admin/doctors/${d._id}/edit`}
                        className="btn btn-ghost btn-sm"
                        title="Edit"
                      >
                        <Edit className="size-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(d._id, d.name)}
                        className="btn btn-ghost btn-sm text-error"
                        title="Delete"
                        disabled={deleteMut.isLoading}
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

export default DoctorManagement;