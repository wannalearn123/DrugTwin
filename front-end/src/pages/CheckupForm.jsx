import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { usePatientDetails, useCreateCheckup } from '../hooks/useDoctor';
import { ArrowLeft, Save, Activity, Heart, Weight, Droplet } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';

const CheckupForm = () => {
  const nav = useNavigate();
  const { patientId } = useParams();
  const { data, isLoading } = usePatientDetails(patientId);
  const createMut = useCreateCheckup();

  const [form, setForm] = useState({
    vitals: {
      systolicBP: '',
      diastolicBP: '',
      heartRate: '',
      weight: '',
      hba1c: '',
      fbg: '',
    },
    symptoms: '',
    diagnosis: '',
    notes: '',
    nextAppointment: '',
  });

  const patient = data?.data?.patient;
  const checkups = data?.data?.checkups || [];

  const updateVital = (field, value) => {
    setForm((prev) => ({
      ...prev,
      vitals: { ...prev.vitals, [field]: value },
    }));
  };

  const submit = (e) => {
    e.preventDefault();

    const payload = {
      patientId,
      vitals: {
        systolicBP: Number(form.vitals.systolicBP),
        diastolicBP: Number(form.vitals.diastolicBP),
        heartRate: Number(form.vitals.heartRate),
        weight: Number(form.vitals.weight),
        hba1c: form.vitals.hba1c ? Number(form.vitals.hba1c) : undefined,
        fbg: form.vitals.fbg ? Number(form.vitals.fbg) : undefined,
      },
      symptoms: form.symptoms
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      diagnosis: form.diagnosis,
      notes: form.notes,
      nextAppointment: form.nextAppointment || undefined,
    };

    createMut.mutate(payload, {
      onSuccess: () => nav('/doctor/dashboard'),
    });
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

  return (
    <DashboardLayout>
      <div className="p-6 max-w-4xl mx-auto">
        {/* Rest of your CheckupForm code stays the same */}
        {/* Just make sure all the form content is here */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => nav(-1)} className="btn btn-ghost btn-sm">
            <ArrowLeft />
          </button>
          <div>
            <h1 className="text-3xl font-bold">Patient Check-up</h1>
            <p className="text-gray-600">{patient?.name}</p>
          </div>
        </div>

        {/* Patient Info and Last Checkup cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title text-lg">Patient Info</h3>
              <div className="space-y-2 text-sm">
                <p><strong>DOB:</strong> {new Date(patient?.dateOfBirth).toLocaleDateString()}</p>
                <p><strong>Blood:</strong> {patient?.bloodType || 'N/A'}</p>
                <p><strong>Phone:</strong> {patient?.phone}</p>
                {patient?.allergies?.length > 0 && (
                  <div className="alert alert-warning py-2">
                    <span className="text-xs">⚠️ {patient.allergies.join(', ')}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {checkups[0] && (
            <div className="card bg-base-100 shadow-xl lg:col-span-2">
              <div className="card-body">
                <h3 className="card-title text-lg">Last Check-up</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">BP</p>
                    <p className="font-semibold">{checkups[0].vitals.systolicBP}/{checkups[0].vitals.diastolicBP} mmHg</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Heart Rate</p>
                    <p className="font-semibold">{checkups[0].vitals.heartRate} bpm</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Weight</p>
                    <p className="font-semibold">{checkups[0].vitals.weight} kg</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Date</p>
                    <p className="font-semibold">{new Date(checkups[0].createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={submit} className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title mb-4">Vital Signs</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* All your form fields here - keeping them as they are */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text flex items-center gap-2">
                    <Activity className="w-4 h-4" />Systolic BP (mmHg) *
                  </span>
                </label>
                <input type="number" className="input input-bordered" value={form.vitals.systolicBP} onChange={(e) => updateVital('systolicBP', e.target.value)} min="70" max="250" required />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text flex items-center gap-2">
                    <Activity className="w-4 h-4" />Diastolic BP (mmHg) *
                  </span>
                </label>
                <input type="number" className="input input-bordered" value={form.vitals.diastolicBP} onChange={(e) => updateVital('diastolicBP', e.target.value)} min="40" max="150" required />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text flex items-center gap-2">
                    <Heart className="w-4 h-4" />Heart Rate (bpm) *
                  </span>
                </label>
                <input type="number" className="input input-bordered" value={form.vitals.heartRate} onChange={(e) => updateVital('heartRate', e.target.value)} min="40" max="200" required />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text flex items-center gap-2">
                    <Weight className="w-4 h-4" />Weight (kg) *
                  </span>
                </label>
                <input type="number" step="0.1" className="input input-bordered" value={form.vitals.weight} onChange={(e) => updateVital('weight', e.target.value)} min="1" max="500" required />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text flex items-center gap-2">
                    <Droplet className="w-4 h-4" />HbA1c (%)
                  </span>
                </label>
                <input type="number" step="0.1" className="input input-bordered" value={form.vitals.hba1c} onChange={(e) => updateVital('hba1c', e.target.value)} min="3" max="15" />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text flex items-center gap-2">
                    <Droplet className="w-4 h-4" />FBG (mg/dL)
                  </span>
                </label>
                <input type="number" className="input input-bordered" value={form.vitals.fbg} onChange={(e) => updateVital('fbg', e.target.value)} min="30" max="600" />
              </div>
            </div>

            <div className="divider"></div>
            <h3 className="text-lg font-semibold mb-2">Clinical Assessment</h3>

            <div className="form-control">
              <label className="label"><span className="label-text">Symptoms (comma-separated)</span></label>
              <textarea className="textarea textarea-bordered h-24" placeholder="Headache, Fever, Cough" value={form.symptoms} onChange={(e) => setForm({ ...form, symptoms: e.target.value })} />
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text">Diagnosis</span></label>
              <textarea className="textarea textarea-bordered h-24" placeholder="Enter diagnosis..." value={form.diagnosis} onChange={(e) => setForm({ ...form, diagnosis: e.target.value })} />
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text">Notes</span></label>
              <textarea className="textarea textarea-bordered h-24" placeholder="Additional notes..." value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text">Next Appointment</span></label>
              <input type="datetime-local" className="input input-bordered" value={form.nextAppointment} onChange={(e) => setForm({ ...form, nextAppointment: e.target.value })} />
            </div>

            <div className="card-actions justify-end mt-6">
              <button type="button" onClick={() => nav(-1)} className="btn btn-ghost">Cancel</button>
              <button type="submit" className="btn btn-primary gap-2" disabled={createMut.isLoading}>
                <Save className="w-4 h-4" />
                {createMut.isLoading ? 'Saving...' : 'Save Check-up'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default CheckupForm;