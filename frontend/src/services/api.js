import axios from 'axios';

const api = axios.create({
  baseURL:'http://localhost:5000/api',
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

export const deleteLearningSession = async (documentId) => {
  try {
    const response = await api.delete(`/documents/${documentId}`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export default api;
