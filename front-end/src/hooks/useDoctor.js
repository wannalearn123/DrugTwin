import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { doctorAPI } from '../api/doctorAPI';
import toast from 'react-hot-toast';

const DOCTORS_KEY = 'doctors';
const MY_PATIENTS_KEY = 'doctor-patients';
const CHECKUPS_KEY = 'checkups';

// Doctor's own hooks
export const useMyPatients = (filters = {}) => 
  useQuery({
    queryKey: [MY_PATIENTS_KEY, filters],
    queryFn: () => doctorAPI.getMyPatients(filters),
  });

export const usePatientDetails = (id) => 
  useQuery({
    queryKey: [MY_PATIENTS_KEY, id],
    queryFn: () => doctorAPI.getPatientDetails(id),
    enabled: !!id,
  });

export const useCreateCheckup = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: doctorAPI.createCheckup,
    onSuccess: () => {
      qc.invalidateQueries([CHECKUPS_KEY]);
      qc.invalidateQueries([MY_PATIENTS_KEY]);
      toast.success('Checkup saved successfully');
    },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed to save checkup'),
  });
};

export const useCheckupHistory = (patientId, filters = {}) => 
  useQuery({
    queryKey: [CHECKUPS_KEY, patientId, filters],
    queryFn: () => doctorAPI.getCheckupHistory(patientId, filters),
    enabled: !!patientId,
  });

// Admin managing doctors
export const useDoctors = (filters = {}) => 
  useQuery({
    queryKey: [DOCTORS_KEY, filters],
    queryFn: () => doctorAPI.getAllDoctors(filters),
  });

export const useDoctor = (id) => 
  useQuery({
    queryKey: [DOCTORS_KEY, id],
    queryFn: () => doctorAPI.getDoctor(id),
    enabled: !!id,
  });

export const useCreateDoctor = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: doctorAPI.createDoctor,
    onSuccess: () => {
      qc.invalidateQueries([DOCTORS_KEY]);
      toast.success('Doctor created successfully');
    },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed to create doctor'),
  });
};

export const useUpdateDoctor = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: doctorAPI.updateDoctor,
    onSuccess: () => {
      qc.invalidateQueries([DOCTORS_KEY]);
      toast.success('Doctor updated successfully');
    },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed to update doctor'),
  });
};

export const useDeleteDoctor = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: doctorAPI.deleteDoctor,
    onSuccess: () => {
      qc.invalidateQueries([DOCTORS_KEY]);
      toast.success('Doctor deleted successfully');
    },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed to delete doctor'),
  });
};

export const useAssignDoctor = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: doctorAPI.assignDoctor,
    onSuccess: () => {
      qc.invalidateQueries(['patients']);
      toast.success('Doctor assigned successfully');
    },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed to assign doctor'),
  });
};

export const useAvailableDoctors = () => 
  useQuery({
    queryKey: ['available-doctors'],
    queryFn: () => doctorAPI.getAvailableDoctors(),
  });