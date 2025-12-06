import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

// Base URL ends in /api/auth
const api = axios.create({
  baseURL: `${BACKEND_URL}/api/auth`, 
  withCredentials: true,
});

export const registerUser = async (userData) => {
  const response = await api.post('/register', userData);
  return response.data;
};

export const loginUser = async (userData) => {
  const response = await api.post('/login', userData);
  return response.data;
};

export const logoutUser = async () => {
  const response = await api.post('/logout');
  return response.data;
};

export const getUserProfile = async () => {
  const response = await api.get('/me'); 
  return response.data;
};

export const getLeaderboardData = async () => {
  const response = await api.get('/leaderboard'); 
  return response.data;
};

export const updateUser = async (userData) => {
  const response = await api.put('/profile', userData);
  return response.data;
};