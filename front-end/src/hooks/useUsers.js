import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userAPI } from '../api/userAPI';
import toast from 'react-hot-toast';

const USERS_KEY = 'users';

export const useUsers = (filters = {}) => 
  useQuery({
    queryKey: [USERS_KEY, filters],
    queryFn: () => userAPI.getAllUsers(filters),
  });

export const useUser = (id) => 
  useQuery({
    queryKey: [USERS_KEY, id],
    queryFn: () => userAPI.getUser(id),
    enabled: !!id,
  });

export const useCreateUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: userAPI.createUser,
    onSuccess: () => {
      qc.invalidateQueries([USERS_KEY]);
      toast.success('User created successfully');
    },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed to create user'),
  });
};

export const useUpdateUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: userAPI.updateUser,
    onSuccess: () => {
      qc.invalidateQueries([USERS_KEY]);
      toast.success('User updated successfully');
    },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed to update user'),
  });
};

export const useDeleteUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: userAPI.deleteUser,
    onSuccess: () => {
      qc.invalidateQueries([USERS_KEY]);
      toast.success('User deleted successfully');
    },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed to delete user'),
  });
};

export const useToggleUserStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: userAPI.toggleStatus,
    onSuccess: () => {
      qc.invalidateQueries([USERS_KEY]);
      toast.success('User status updated');
    },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed to update status'),
  });
};