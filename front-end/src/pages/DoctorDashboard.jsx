import { useState } from 'react';
import { useMyPatients } from '../hooks/useDoctor';
import { Link } from 'react-router';
import { Search, Stethoscope, Calendar, Activity } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';

const DoctorDashboard = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data, isLoading } = useMyPatients({ page, limit: 10, search });

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

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">My Patients</h1>
            <p className="text-gray-600">View and manage your assigned patients</p>
          </div>
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-title">Total Patients</div>
              <div className="stat-value text-primary">{total}</div>
            </div>
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

        {/* Patient Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {patients.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500">
              No patients assigned yet
            </div>
          ) : (
            patients.map((patient) => (
              <div
                key={patient._id}
                className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow"
              >
                <div className="card-body">
                  <h2 className="card-title">
                    {patient.name}
                    <span
                      className={`badge ${
                        patient.isActive ? 'badge-success' : 'badge-error'
                      }`}
                    >
                      {patient.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </h2>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span>
                        DOB: {new Date(patient.dateOfBirth).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-gray-500" />
                      <span>Blood: {patient.bloodType || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">📞</span>
                      <span>{patient.phone}</span>
                    </div>
                    {patient.allergies?.length > 0 && (
                      <div className="alert alert-warning py-2">
                        <span className="text-xs">
                          ⚠️ Allergies: {patient.allergies.join(', ')}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="card-actions justify-end mt-4">
                    <Link
                      to={`/doctor/checkup/${patient._id}`}
                      className="btn btn-primary btn-sm gap-2"
                    >
                      <Stethoscope className="w-4 h-4" />
                      Check-up
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
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

export default DoctorDashboard;