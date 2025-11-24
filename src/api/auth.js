import axios from 'axios';
const API_BASE_URL=import.meta.env.VITE_API_BASE_URL; 


export const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/Auth/login`, credentials);
    return response.data;
  } catch (error) {
    return error.response?.data ||  { message: 'Registration failed' };
  }
};
export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/Auth/register-Attendee`, userData);
    return response.data;
  } catch (error) {
    return error.response?.data || { message: 'Registration failed' };
  }
};
export const registerOrganizer = async (formData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/Auth/register-organizer`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    return error.response?.data || { message: 'Organizer registration failed' };
  }
};