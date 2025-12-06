import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

const api = axios.create({
  baseURL: `${BACKEND_URL}/api`, 
  withCredentials: true,
});

export const getTasks = async () => {
  const { data } = await api.get('/tasks');
  return data;
};

export const createTask = async (taskData) => {
  const { data } = await api.post('/tasks', taskData);
  return data;
};

export const toggleTask = async (id) => {
  const { data } = await api.put(`/tasks/${id}/complete`);
  return data;
};

export const deleteTask = async (id) => {
  const { data } = await api.delete(`/tasks/${id}`);
  return data;
};

export const updateTask = async ({ id, data }) => {
  const response = await api.put(`/tasks/${id}`, data);
  return response.data;
};