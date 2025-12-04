import React from 'react'
import { useParams, useNavigate } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import Table from '../components/Table'

const PatientDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  // Fetch patient data
  const { data: patient, isLoading } = useQuery({
    queryKey: ['patient', id],
    queryFn: async () => {
      const res = await fetch(`/api/patients/${id}`)
      if (!res.ok) throw new Error('Failed to fetch patient')
      return res.json()
    }
  })

  if (isLoading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>

  const personalInfo = [
    { label: 'Name', value: patient?.name },
    { label: 'Age', value: patient?.age },
    { label: 'Gender', value: patient?.gender },
    { label: 'Phone', value: patient?.phone },
    { label: 'Address', value: patient?.address },
    { label: 'Blood Type', value: patient?.bloodType }
  ]

  const medicalInfo = [
    { label: 'Allergies', value: patient?.allergies?.join(', ') || 'None' },
    { label: 'Assigned Doctor', value: patient?.assignedDoctor?.name || 'Not assigned' },
    { label: 'Last Visit', value: patient?.lastVisit ? new Date(patient.lastVisit).toLocaleDateString() : 'N/A' }
  ]

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Patient Details</h1>
        <div className="space-x-2">
          <button onClick={() => navigate(`/admin/patients/${id}/edit`)} className="btn btn-primary">
            Edit Patient
          </button>
          <button onClick={() => navigate(`/admin/patients/${id}/assign-doctor`)} className="btn btn-black btn-outline">
            Assign Doctor
          </button>
          <button onClick={() => navigate('/admin/patients')} className="btn btn-ghost">
            Back
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Table title="Personal Information" data={personalInfo} />
        <Table title="Medical Information" data={medicalInfo} />
      </div>

      {/* Clinical History */}
      <div className="mt-6">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Clinical History</h2>
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Diagnosis</th>
                    <th>Doctor</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {patient?.clinicalHistory?.map((record, index) => (
                    <tr key={index}>
                      <td>{new Date(record.date).toLocaleDateString()}</td>
                      <td>{record.diagnosis}</td>
                      <td>{record.doctor?.name}</td>
                      <td>
                        <button className="btn btn-sm btn-ghost">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PatientDetail