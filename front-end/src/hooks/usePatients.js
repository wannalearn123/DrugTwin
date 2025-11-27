import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { patientAPI } from '../api/patientAPI';
import toast from 'react-hot-toast';

const KEY = 'patients';

export const usePatients = (filters = {}) => 
  useQuery({
    queryKey: [KEY, filters],
    queryFn: () => patientAPI.getAll(filters),
  });

export const usePatient = (id) => 
  useQuery({
    queryKey: [KEY, id],
    queryFn: () => patientAPI.getOne(id),
    enabled: !!id,
  });

export const useAddPatient = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: patientAPI.add,
    onSuccess: () => {
      qc.invalidateQueries([KEY]);
      toast.success('Patient added');
    },
    onError: (e) => toast.error(e.response?.data?.message || 'Error'),
  });
};

export const useEditPatient = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: patientAPI.edit,
    onSuccess: () => {
      qc.invalidateQueries([KEY]);
      toast.success('Patient updated');
    },
    onError: (e) => toast.error(e.response?.data?.message || 'Error'),
  });
};

export const useRemovePatient = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: patientAPI.remove,
    onSuccess: () => {
      qc.invalidateQueries([KEY]);
      toast.success('Patient removed');
    },
    onError: (e) => toast.error(e.response?.data?.message || 'Error'),
  });
};