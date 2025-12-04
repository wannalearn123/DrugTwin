import React from 'react'
import { useParams, useNavigate } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import Table from '../components/Table'

const DoctorDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data: doctor, isLoading } = useQuery({
    queryKey: ['doctor', id],
    queryFn: async () => {
      const res = await fetch(`/api/doctors/${id}`)
      if (!res.ok) throw new Error('Failed to fetch doctor')
      return res.json()
    }
  })

  if (isLoading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>

  const doctorInfo = [
    { label: 'Name', value: doctor?.name },
    { label: 'Specialization', value: doctor?.specialization },
    { label: 'Phone', value: doctor?.phone },
    { label: 'Email', value: doctor?.email },
    { label: 'License Number', value: doctor?.licenseNumber },
    { label: 'Years of Experience', value: doctor?.experience }
  ]

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Doctor Details</h1>
        <div className="space-x-2">
          <button onClick={() => navigate(`/admin/doctors/${id}/edit`)} className="btn btn-primary">
            Edit Doctor
          </button>
          <button onClick={() => navigate('/admin/doctors')} className="btn btn-ghost">
            Back
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Table title="Doctor Information" data={doctorInfo} />
      </div>

      {/* Assigned Patients */}
      <div className="mt-6">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Assigned Patients</h2>
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Age</th>
                    <th>Phone</th>
                    <th>Last Visit</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {doctor?.assignedPatients?.map((patient) => (
                    <tr key={patient._id}>
                      <td>{patient.name}</td>
                      <td>{patient.age}</td>
                      <td>{patient.phone}</td>
                      <td>{patient.lastVisit ? new Date(patient.lastVisit).toLocaleDateString() : 'N/A'}</td>
                      <td>
                        <button 
                          onClick={() => navigate(`/admin/patients/${patient._id}`)}
                          className="btn btn-sm btn-ghost"
                        >
                          View
                        </button>
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

export default DoctorDetail