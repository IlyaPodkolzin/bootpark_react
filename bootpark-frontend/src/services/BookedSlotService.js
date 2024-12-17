import apiClient from "../config/AxiosConfig";


const REST_API_BASE_URL = 'http://localhost:8001/api/booked';

export const createBookedSlot = (bookedSlot) => apiClient.post(REST_API_BASE_URL, bookedSlot);

export const removeBookedSlotForUser = (userId, bookedSlotId) => apiClient.delete(REST_API_BASE_URL + "/user/" + userId + "/" + bookedSlotId);