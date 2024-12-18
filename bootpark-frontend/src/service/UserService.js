import apiClient from "../config/AxiosConfig";


const REST_API_BASE_URL = 'http://localhost:8001/api/user';

export const getUser = (userId) => apiClient.get(REST_API_BASE_URL + '/' + userId);

export const deleteUser = (userId) => apiClient.delete(REST_API_BASE_URL + "/" + userId);