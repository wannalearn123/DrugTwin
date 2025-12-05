import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useCreateUser, useUpdateUser, useUser } from '../hooks/useUsers';
import { ArrowLeft } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';

const UserForm = () => {
  const nav = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const { data } = useUser(id);
  const createMut = useCreateUser();
  const updateMut = useUpdateUser();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'patient',
  });

  useEffect(() => {
    if (isEdit && data?.data?.user) {
      const user = data.data.user;
      setForm({
        name: user.name,
        email: user.email,
        password: '', // Don't prefill password
        role: user.role,
      });
    }
  }, [isEdit, data]);

  const submit = (e) => {
    e.preventDefault();
    const mut = isEdit ? updateMut : createMut;
    const payload = isEdit 
      ? { id, ...form, ...(form.password ? { password: form.password } : {}) } 
      : form;
    
    mut.mutate(payload, {
      onSuccess: () => nav('/admin/users'),
    });
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => nav(-1)} className="btn btn-ghost btn-sm">
            <ArrowLeft />
          </button>
          <h1 className="text-3xl font-bold">{isEdit ? 'Edit' : 'New'} User</h1>
        </div>

        <form onSubmit={submit} className="card bg-white shadow-xl">
          <div className="card-body space-y-4">
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
                <span className="label-text">Email *</span>
              </label>
              <input
                type="email"
                className="input input-bordered"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">
                  Password {isEdit ? '(leave blank to keep current)' : '*'}
                </span>
              </label>
              <input
                type="password"
                className="input input-bordered"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required={!isEdit}
                minLength={6}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Role *</span>
              </label>
              <select
                className="select select-bordered"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                required
              >
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
                <option value="pharmacist">Pharmacist</option>
                <option value="admin">Admin</option>
              </select>
              <label className="label">
                <span className="label-text-alt">
                  User can create profile later based on this role
                </span>
              </label>
            </div>

            <div className="card-actions justify-end mt-6">
              <button type="button" onClick={() => nav(-1)} className="btn btn-ghost">
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={createMut.isLoading || updateMut.isLoading}
              >
                {isEdit ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default UserForm;