import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useAddPatient, useEditPatient, usePatient } from '../hooks/usePatients';
import { useAvailableDoctors } from '../hooks/useDoctor';
import { ArrowLeft } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';

const PatientForm = () => {
  const nav = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const { data } = usePatient(id);
  const { data: doctorsData } = useAvailableDoctors();
  const addMut = useAddPatient();
  const editMut = useEditPatient();
  
  const [form, setForm] = useState({
    userId: '',
    name: '',
    dateOfBirth: '',
    phone: '',
    bloodType: '',
    allergies: '',
    assignedDoctorId: '',
  });

  const doctors = doctorsData?.data?.doctors || [];

  useEffect(() => {
    if (isEdit && data?.data?.patient) {
      const p = data.data.patient;
      setForm({
        userId: p.userId?._id || '',
        name: p.name,
        dateOfBirth: new Date(p.dateOfBirth).toISOString().split('T')[0],
        phone: p.phone,
        bloodType: p.bloodType || '',
        allergies: p.allergies?.join(', ') || '',
        assignedDoctorId: p.assignedDoctorId?._id || '',
      });
    }
  }, [isEdit, data]);

  const submit = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      allergies: form.allergies.split(',').map(a => a.trim()).filter(Boolean),
      assignedDoctorId: form.assignedDoctorId || undefined,
    };
    
    const mut = isEdit ? editMut : addMut;
    const finalData = isEdit ? { id, ...payload } : payload;
    
    mut.mutate(finalData, { onSuccess: () => nav('/admin/patients') });
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => nav(-1)} className="btn btn-ghost btn-sm">
            <ArrowLeft />
          </button>
          <h1 className="text-3xl font-bold">{isEdit ? 'Edit' : 'New'} Patient</h1>
        </div>

        <form onSubmit={submit} className="card bg-white shadow-xl">
          <div className="card-body space-y-4">
            {!isEdit && (
              <div className="form-control">
                <label className="label">
                  <span className="label-text">User ID *</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
                  value={form.userId}
                  onChange={(e) => setForm({ ...form, userId: e.target.value })}
                  required
                />
              </div>
            )}

            <div className="form-control">
              <label className="label">
                <span className="label-text">Name *</span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Date of Birth *</span>
              </label>
              <input
                type="date"
                className="input input-bordered"
                value={form.dateOfBirth}
                onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Phone *</span>
              </label>
              <input
                type="tel"
                className="input input-bordered"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Blood Type</span>
              </label>
              <select
                className="select select-bordered"
                value={form.bloodType}
                onChange={(e) => setForm({ ...form, bloodType: e.target.value })}
              >
                <option value="">Select</option>
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Assigned Doctor</span>
              </label>
              <select
                className="select select-bordered"
                value={form.assignedDoctorId}
                onChange={(e) => setForm({ ...form, assignedDoctorId: e.target.value })}
              >
                <option value="">No doctor assigned</option>
                {doctors.map((doc) => (
                  <option key={doc._id} value={doc._id}>
                    {doc.name} - {doc.specialization}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Allergies (comma-separated)</span>
              </label>
              <textarea
                className="textarea textarea-bordered"
                value={form.allergies}
                onChange={(e) => setForm({ ...form, allergies: e.target.value })}
                placeholder="Penicillin, Peanuts"
              />
            </div>

            <div className="card-actions justify-end mt-6">
              <button type="button" onClick={() => nav(-1)} className="btn btn-ghost">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {isEdit ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default PatientForm;