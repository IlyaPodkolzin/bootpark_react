import { useState, useEffect } from "react";
import apiClient from "../../config/AxiosConfig";
import { removeBookedSlotForUser } from "../../service/BookedSlotService";
import { updateParkingAvailableSlotsOnly } from "../../service/ParkingService";

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

    // Загружаем все бронирования пользователя (функция)
    const fetchBookedSlots = async () => {
        try {
            const response = await apiClient.get(
                `http://localhost:8001/api/booked/user/${localStorage.getItem("user_id")}`
            );
            setBookedSlots(response.data); // Обновляем состояние bookedSlots
            setLoading(false);
        } catch (err) {
            setError("Ошибка при загрузке данных о бронированиях");
            setLoading(false);
        }
    };

    // Загружаем данные о парковках из бронирований (функция)
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
                parkingsMap[parking.id] = [parking.name, parking.address, parking.availableSlotsAmount];
            });

            setParkings(parkingsMap);
            setLoading(false);
        } catch (err) {
            setError("Ошибка при загрузке данных о парковках");
            setLoading(false);
        }
    };

    // После удаления брони нужно обновить содержимое страницы (снова получить список всех броней пользователя)
    function removeBookedForUser(userId, bookedId) {
        removeBookedSlotForUser(userId, bookedId).then((response) => {
            fetchBookedSlots();
        }).catch(error => {
            console.error(error);
        });
    }

    // Первый useEffect: Загрузка забронированных слотов
    useEffect(() => {
        fetchBookedSlots();
    }, []);

    // Второй useEffect: Загрузка данных о парковках после обновления bookedSlots
    useEffect(() => {
        fetchParkings();
    }, [bookedSlots]); // Зависимость: запускать при изменении bookedSlots

    if (loading) return <div>Загрузка...</div>;
    if (error) return <div>{error}</div>;
    
    return (
        <div className="container">
            <h1 className="text-center" style={{margin: "10px"}}>Личный кабинет</h1>
            <h2 className="text-center">Добро пожаловать, {localStorage.getItem("username")}!</h2>
            <h3 className="text-center">Ваши бронирования:</h3>
            <table className='table'>
                <tbody>
                    {bookedSlots.length > 0 ? (
                        bookedSlots.map((bookedSlot, index) => (
                        <tr key={index}>
                            <td className="container p-4 my-1 bg-dark text-white fs-5">
                                <strong>Название парковки:</strong> {parkings[bookedSlot.parkingId]?.[0] || "Неизвестно"}
                                <br/>
                                <strong>Адрес парковки:</strong> {parkings[bookedSlot.parkingId]?.[1] || "Неизвестно"}
                                <br/>
                                <strong>Действителен до:</strong> {formatDateToDDMMYYYY(bookedSlot.dateOfEnd)}
                            </td>
                            <td className="container p-4 my-1 bg-dark text-white fs-5">
                                <button
                                    className='btn btn-danger'
                                    onClick={() => {
                                            removeBookedForUser(localStorage.getItem("user_id"), bookedSlot.id)
                                            updateParkingAvailableSlotsOnly(bookedSlot.parkingId, parkings[bookedSlot.parkingId]?.[2] + 1)
                                        }
                                    }
                                    style={{margin:'10px'}}>Удалить</button>
                            </td>
                        </tr>
                        ))
                    ) : (
                    <tr>
                        <td>
                            <p className="text-center fs-5">У вас пока нет активных бронирований.</p>
                        </td>
                    </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};


export default ProfileComponent;