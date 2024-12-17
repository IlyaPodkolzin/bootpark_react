import axios from 'axios';

// Создание экземпляра Axios
const apiClient = axios.create({
  baseURL: 'http://localhost:8001/api', // Базовый URL для API
  headers: {
    'Content-Type': 'application/json',
  },
});

// Интерцептор для добавления токена в заголовки
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Получаем токен из localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Добавляем токен в заголовок
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
