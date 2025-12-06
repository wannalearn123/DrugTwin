import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useCreateDoctor, useUpdateDoctor, useDoctor } from '../hooks/useDoctor';
import { ArrowLeft } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';

const DoctorForm = () => {
  const nav = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const { data } = useDoctor(id);
  const createMut = useCreateDoctor();
  const updateMut = useUpdateDoctor();

  const [form, setForm] = useState({
    userId: '',
    name: '',
    specialization: '',
    licenseNumber: '',
    phone: '',
  });

  useEffect(() => {
    if (isEdit && data?.data?.doctor) {
      const doc = data.data.doctor;
      setForm({
        userId: doc._id || '',
        name: doc.userId?.name,
        specialization: doc.specialties[0] || '',
        licenseNumber: doc.licenseNumber,
        phone: doc.phone || '',
      });
    }
  }, [isEdit, data]);

  const submit = (e) => {
    e.preventDefault();
    const mut = isEdit ? updateMut : createMut;
    const payload = isEdit ? { id, ...form } : form;
    
    mut.mutate(payload, {
      onSuccess: () => nav('/admin/doctors'),
    });
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => nav(-1)} className="btn btn-ghost btn-sm">
            <ArrowLeft />
          </button>
          <h1 className="text-3xl font-bold">{isEdit ? 'Edit' : 'New'} Doctor</h1>
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
                  placeholder="User account ID with 'doctor' role"
                />
                <label className="label">
                  <span className="label-text-alt">User must have doctor role</span>
                </label>
              </div>
            )}

            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Name *</span>
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
                <span className="label-text">Specialization *</span>
              </label>
              <select
                className="select select-bordered"
                value={form.specialization}
                onChange={(e) => setForm({ ...form, specialization: e.target.value })}
                required
              >
                <option value="">Select specialization</option>
                <option value="General Practitioner">General Practitioner</option>
                <option value="Cardiologist">Cardiologist</option>
                <option value="Endocrinologist">Endocrinologist</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Pediatrician">Pediatrician</option>
                <option value="Psychiatrist">Psychiatrist</option>
                <option value="Surgeon">Surgeon</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">License Number *</span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                value={form.licenseNumber}
                onChange={(e) => setForm({ ...form, licenseNumber: e.target.value })}
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Phone</span>
              </label>
              <input
                type="tel"
                className="input input-bordered"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
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

export default DoctorForm;