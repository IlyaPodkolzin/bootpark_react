import { useState, useEffect } from "react";
import apiClient from "../config/AxiosConfig";

const ProfileComponent = () => {
    const [bookedSlots, setBookedSlots] = useState([]);
    const [parkings, setParkings] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Функция для форматирования даты в "ДД-ММ-ГГГГ"
    const formatDateToDDMMYYYY = (isoDate) => {
        const date = new Date(isoDate);
        const day = String(date.getDate()).padStart(2, "0"); // День с ведущим 0
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Месяц с ведущим 0
        const year = date.getFullYear(); // Год
        return `${day}-${month}-${year}`; // Формат "ДД-ММ-ГГГГ"
    };

    // Первый useEffect: Загрузка забронированных слотов
    useEffect(() => {
        const fetchBookedSlots = async () => {
            try {
                const response = await apiClient.get(
                    `http://localhost:8001/api/booked/user/${localStorage.getItem("user_id")}`
                );
                setBookedSlots(response.data); // Обновляем состояние bookedSlots
            } catch (err) {
                setError("Ошибка при загрузке данных о бронированиях");
                setLoading(false);
            }
        };

        fetchBookedSlots();
    }, []);

    // Второй useEffect: Загрузка данных о парковках после обновления bookedSlots
    useEffect(() => {
        const fetchParkings = async () => {
            try {
                if (bookedSlots.length === 0) return; // Если слотов нет, не загружаем парковки

                const uniqueParkingIds = [...new Set(bookedSlots.map(slot => slot.parkingId))];
                const parkingRequests = uniqueParkingIds.map(parkingId =>
                    apiClient.get(`http://localhost:8001/api/parkings/general/${parkingId}`)
                );

                const parkingsResponse = await Promise.all(parkingRequests);

                // Создание маппинга parkingId -> данные о парковке
                const parkingsMap = {};
                parkingsResponse.forEach(response => {
                    const parking = response.data;
                    parkingsMap[parking.id] = [parking.name, parking.address];
                });

                setParkings(parkingsMap);
                setLoading(false);
            } catch (err) {
                setError("Ошибка при загрузке данных о парковках");
                setLoading(false);
            }
        };

        fetchParkings();
    }, [bookedSlots]); // Зависимость: запускать при изменении bookedSlots

    if (loading) return <div>Загрузка...</div>;
    if (error) return <div>{error}</div>;
    
    return (
        <div className="container">
            <h1>Личный кабинет</h1>
            <h2>Добро пожаловать, {localStorage.getItem("username")}!</h2>
            
            <div>
                <h3>Ваши бронирования:</h3>
                {bookedSlots.length > 0 ? (
                <ul>
                    {
                    bookedSlots.map((bookedSlot, index) => (
                    <div class="container p-5 my-1 bg-dark text-white">
                        <strong>Название парковки:</strong> {parkings[bookedSlot.parkingId]?.[0] || "Неизвестно"}
                        <br/>
                        <strong>Адрес парковки:</strong> {parkings[bookedSlot.parkingId]?.[1] || "Неизвестно"}
                        <br/>
                        <strong>Действителен до:</strong> {formatDateToDDMMYYYY(bookedSlot.dateOfEnd)}
                    </div>
                    ))
                    }
                </ul>
                ) : (
                <p>У вас пока нет активных бронирований.</p>
                )}
            </div>
        </div>
    );
};


export default ProfileComponent;