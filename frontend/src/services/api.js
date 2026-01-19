import axios from 'axios';

// Configure axios instance
const api = axios.create({
  baseURL:'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const createNewLearningSession = async (data) => {
  try {
    const response = await api.post('/documents', data);
    return response.data;
  } catch (error) {
    return response.data;
  }
};

export const getAllLearningSessions = async () => {
  try {
    const response = await api.get('/documents');
    return response.data;
  } catch (error) {
    return error.response.data;
}
};

export default api;
