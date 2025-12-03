import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

const AssignDoctor = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [selectedDoctor, setSelectedDoctor] = useState('')

  const { data: patient } = useQuery({
    queryKey: ['patient', id],
    queryFn: async () => {
      const res = await fetch(`/api/patients/${id}`)
      if (!res.ok) throw new Error('Failed to fetch patient')
      return res.json()
    }
  })

  const { data: doctors } = useQuery({
    queryKey: ['doctors'],
    queryFn: async () => {
      const res = await fetch('/api/doctors')
      if (!res.ok) throw new Error('Failed to fetch doctors')
      return res.json()
    }
  })

  const assignMutation = useMutation({
    mutationFn: async (doctorId) => {
      const res = await fetch(`/api/patients/${id}/assign-doctor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ doctorId })
      })
      if (!res.ok) throw new Error('Failed to assign doctor')
      return res.json()
    },
    onSuccess: () => {
      toast.success('Doctor assigned successfully')
      queryClient.invalidateQueries(['patient', id])
      navigate(`/admin/patients/${id}`)
    },
    onError: () => {
      toast.error('Failed to assign doctor')
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!selectedDoctor) {
      toast.error('Please select a doctor')
      return
    }
    assignMutation.mutate(selectedDoctor)
  }

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Assign Doctor to Patient</h1>
        
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="mb-4">
              <p className="text-lg"><span className="font-semibold">Patient:</span> {patient?.name}</p>
              <p className="text-sm text-gray-600">Current Doctor: {patient?.assignedDoctor?.name || 'None'}</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Select Doctor</span>
                </label>
                <select 
                  className="select select-bordered w-full"
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                  required
                >
                  <option value="">Choose a doctor</option>
                  {doctors?.map((doctor) => (
                    <option key={doctor._id} value={doctor._id}>
                      {doctor.name} - {doctor.specialization}
                    </option>
                  ))}
                </select>
              </div>

              <div className="card-actions justify-end mt-6">
                <button 
                  type="button"
                  onClick={() => navigate(`/admin/patients/${id}`)}
                  className="btn btn-ghost"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="btn btn-primary"
                  disabled={assignMutation.isPending}
                >
                  {assignMutation.isPending ? 'Assigning...' : 'Assign Doctor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AssignDoctor