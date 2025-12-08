import React, { useState } from 'react';
import { useDoctors, useDeleteDoctor } from '../hooks/useDoctor';
import { Link } from 'react-router';
import {
  Search,
  UserPlus,
  Eye,
  Edit,
  Trash2,
  Users,
  AlertTriangle,
  X
} from 'lucide-react';

const DoctorManagementTab = () => {
  // ===== STATE =====
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  // ===== HOOKS =====
  const { data, isLoading, error } = useDoctors({ page, limit: 10, search });
  const deleteMut = useDeleteDoctor();

  // ===== EXTRACT DATA =====
  const doctors = data?.data?.doctors || [];
  const total = data?.data?.total || 0;
  const totalPages = data?.data?.totalPages || 1;

  // ===== HANDLERS =====
  const handleView = (doctor) => {
    setSelectedDoctor(doctor);
    setIsViewModalOpen(true);
  };

  const handleDelete = (doctor) => {
    setSelectedDoctor(doctor);
    setIsConfirmModalOpen(true);
  };

  const executeDelete = () => {
    if (selectedDoctor) {
      deleteMut.mutate(selectedDoctor._id);
      setIsConfirmModalOpen(false);
      setSelectedDoctor(null);
    }
  };

  // ===== LOADING & ERROR STATES =====
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <span>Error loading doctors: {error.message}</span>
      </div>
    );
  }

  // ===== RENDER =====
  return (
    <div className="p-6">
      {/* Header Actions */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex-1 relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search doctors by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
        <Link
          to="/admin/doctors/new"
          className="px-4 py-2 bg-emerald-500 text-white font-medium rounded-lg hover:bg-emerald-600 flex items-center gap-2"
        >
          <UserPlus className="h-4 w-4" />
          Add Doctor
        </Link>
      </div>

      {/* Doctors Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-emerald-100">
              <th className="text-left py-3 px-4 font-semibold text-emerald-700">Doctor</th>
              <th className="text-left py-3 px-4 font-semibold text-emerald-700">Specialization</th>
              <th className="text-left py-3 px-4 font-semibold text-emerald-700">License Number</th>
              <th className="text-left py-3 px-4 font-semibold text-emerald-700">Phone</th>
              <th className="text-left py-3 px-4 font-semibold text-emerald-700">Status</th>
              <th className="text-left py-3 px-4 font-semibold text-emerald-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doctor) => (
              <tr key={doctor._id} className="border-b border-emerald-50 hover:bg-emerald-25">
                <td className="py-3 px-4">
                  <div>
                    <p className="font-medium text-gray-900">{doctor.userId?.name}</p>
                    <p className="text-sm text-gray-600">{doctor.userId?.email}</p>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex flex-wrap gap-1">
                    {doctor.specialties?.map((specialty, idx) => (
                      <span key={idx} className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                        {specialty}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <p className="text-sm text-gray-700">{doctor.licenseNumber}</p>
                </td>
                <td className="py-3 px-4">
                  <p className="text-sm text-gray-700">{doctor.userId?.phone || 'N/A'}</p>
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${doctor.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                    {doctor.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleView(doctor)}
                      className="p-1 text-emerald-600 hover:bg-emerald-100 rounded"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <Link
                      to={`/admin/doctors/${doctor._id}/edit`}
                      className="p-1 text-emerald-600 hover:bg-emerald-100 rounded"
                      title="Edit Doctor"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(doctor)}
                      className="p-1 text-red-600 hover:bg-red-100 rounded"
                      title="Delete"
                      disabled={deleteMut.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {doctors.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">
            {search ? 'No doctors found matching your search.' : 'No doctors added yet.'}
          </p>
        </div>
      )}

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

      {/* View Doctor Modal */}
      {isViewModalOpen && selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
            <div className="p-6 border-b border-emerald-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-emerald-700">Doctor Details</h2>
                <button
                  onClick={() => setIsViewModalOpen(false)}
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
                  <p className="text-gray-900">{selectedDoctor.userId?.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <p className="text-gray-900">{selectedDoctor.userId?.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">License Number</label>
                  <p className="text-gray-900">{selectedDoctor.licenseNumber}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <p className="text-gray-900">{selectedDoctor.userId?.phone || 'N/A'}</p>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Specializations</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedDoctor.specialties?.map((specialty, idx) => (
                      <span key={idx} className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${selectedDoctor.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                    {selectedDoctor.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end">
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

      {/* Confirm Delete Modal */}
      {isConfirmModalOpen && selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-red-100 p-2 rounded-full">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Confirm Delete</h2>
              </div>
              
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete doctor{' '}
                <span className="font-semibold">{selectedDoctor.userId?.name}</span>?
              </p>
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsConfirmModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={executeDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorManagementTab;