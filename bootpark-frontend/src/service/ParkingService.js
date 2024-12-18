import apiClient from "../config/AxiosConfig";


const REST_API_BASE_URL = 'http://localhost:8001/api/parkings';

export const listParkings = () => {
    return apiClient.get(REST_API_BASE_URL + "/general");
}

export const createParking = (parking) => apiClient.post(REST_API_BASE_URL + "/general", parking);

export const getParking = (parkingId) => apiClient.get(REST_API_BASE_URL + '/general/' + parkingId);

export const updateParking = (parkingId, parking) => apiClient.put(REST_API_BASE_URL + '/general/' + parkingId, parking);

export const updateParkingAvailableSlotsOnly = (parkingId, availableSlots) => apiClient.put(REST_API_BASE_URL + '/available_places_only/' + parkingId, availableSlots);

export const deleteParking = (parkingId) => apiClient.delete(REST_API_BASE_URL + '/general/' + parkingId);