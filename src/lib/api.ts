import axios from 'axios';

const API_BASE_URL = import.meta.env.PROD ? '/api' : 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('mintchat_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('mintchat_token');
      localStorage.removeItem('mintchat_user');
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth API
export const authAPI = {
  signIn: (email: string, password: string) =>
    api.post('/auth/signin', { email, password }),
  
  signUp: (name: string, email: string, password: string) =>
    api.post('/auth/signup', { name, email, password }),
  
  resetPassword: (email: string) =>
    api.post('/auth/reset-password', { email }),
};

// Chat API
export const chatAPI = {
  sendMessage: (message: string, conversationId?: string) =>
    api.post('/chat/message', { message, conversationId }),
};

// Conversations API
export const conversationsAPI = {
  getAll: () => api.get('/conversations'),
  getOne: (id: string) => api.get(`/conversations/${id}`),
  delete: (id: string) => api.delete(`/conversations/${id}`),
  rename: (id: string, title: string) => api.patch(`/conversations/${id}`, { title }),
};

// Training API
export const trainingAPI = {
  getAll: (type: string = 'all') => api.get('/training', { params: { type } }),
  addFile: (data: { title: string; content: string; fileType: string; fileSize: number }) =>
    api.post('/training/file', data),
  addLink: (data: { url: string; title: string; content: string }) =>
    api.post('/training/link', data),
  addText: (data: { title: string; content: string }) =>
    api.post('/training/text', data),
  retrain: (id: string) => api.post(`/training/${id}/retrain`),
  delete: (id: string) => api.delete(`/training/${id}`),
};

// Appearance API
export const appearanceAPI = {
  get: () => api.get('/appearance'),
  update: (data: any) => api.put('/appearance', data),
};
