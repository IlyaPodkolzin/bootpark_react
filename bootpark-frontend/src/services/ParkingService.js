import apiClient from "../config/AxiosConfig";


const REST_API_BASE_URL = 'http://localhost:8001/api/parkings';

export const listParkings = () => {
    return apiClient.get(REST_API_BASE_URL);
}

export const createParking = (parking) => apiClient.post(REST_API_BASE_URL, parking);

export const getParking = (parkingId) => apiClient.get(REST_API_BASE_URL + '/' + parkingId);

export const updateParking = (parkingId, parking) => apiClient.put(REST_API_BASE_URL + '/' + parkingId, parking);

export const deleteParking = (parkingId) => apiClient.delete(REST_API_BASE_URL + '/' + parkingId);