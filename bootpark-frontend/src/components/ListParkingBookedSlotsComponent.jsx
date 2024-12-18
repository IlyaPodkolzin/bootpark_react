import React, {useEffect, useState} from 'react'
import { useParams } from 'react-router-dom'
import { deleteBookedSlotByAdmin, listBookedSlotsForParking } from '../services/BookedSlotService';
import { getParking, updateParkingAvailableSlotsOnly } from '../services/ParkingService';
import { deleteUser, getUser } from '../services/UserService';

function ListParkingBookedSlotsComponent() {

    const [bookedSlots, setBookedSlots] = useState([]);
    const [userNames, setUserNames] = useState({});
    const { parkingId } = useParams(); // Достали айди парковки из запроса
    const [parkingName, setParkingName] = useState([]);

    // Получаем название парковки
    useEffect(() => {
        getParking(parkingId).then((response) => {
            setParkingName(response.data.name);
        });
    }, [parkingId]);

    // Получаем все бронирования для парковки
    useEffect(() => {
        getAllBookedSlotsForParking();
    }, []);

    const formatDateToDDMMYYYY = (isoDate) => {
        const date = new Date(isoDate);
        const day = String(date.getDate()).padStart(2, "0"); // День с ведущим 0
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Месяц с ведущим 0
        const year = date.getFullYear(); // Год
        return `${day}-${month}-${year}`; // Формат "ДД-ММ-ГГГГ"
    };

    function getAllBookedSlotsForParking() {
        listBookedSlotsForParking(parkingId).then((response) => {
            const slots = response.data;
            setBookedSlots(slots);
            

            // Загружаем имена пользователей
            const userIds = slots.map(slot => slot.userEntityId);
            fetchUserNames(userIds);
        }).catch(error => {
            console.error(error);
        });
    }

    function fetchUserNames(userIds) {
        // Загружаем имена пользователей только для уникальных userEntityId
        const uniqueUserIds = [...new Set(userIds)];
        const namePromises = uniqueUserIds.map(userId => 
            getUser(userId).then(response => ({ userId, name: response.data.username }))
        );

        Promise.all(namePromises).then(results => {
            const nameMap = {};
            results.forEach(({ userId, name }) => {
                nameMap[userId] = name;
            });
            
            setUserNames(nameMap);
        }).catch(error => {
            console.error('Ошибка загрузки имен пользователей:', error);
        });
    }

    function removeBookedSlots(id) {
        deleteBookedSlotByAdmin(id).then(() => {
            getParking(parkingId).then((response) => {
                updateParkingAvailableSlotsOnly(parkingId, response.data.availableSlotsAmount + 1);
            });
            getAllBookedSlotsForParking();
        }).catch(error => {
            console.error(error);
        });
    }

    function removeUser(id) {
        deleteUser(id).then(() => {
            getAllBookedSlotsForParking();
        }).catch(error => {
            console.error(error);
        });
    }

    return (
        <div className='container'>
            <h2 className='text-center'>Список бронирований для парковки "{parkingName}"</h2>
            <table className='table table-striped table-bordered'>
                <tbody>
                    {bookedSlots.length > 0 ? (
                        bookedSlots.map(bookedSlot =>
                            <tr key={bookedSlot.id}>
                                <td>{formatDateToDDMMYYYY(bookedSlot.dateOfEnd)}</td>
                                <td>{userNames[bookedSlot.userEntityId] || 'Загрузка...'}</td>
                                <td>
                                    <button className='btn btn-danger' onClick={() => removeBookedSlots(bookedSlot.id)}>Удалить бронь</button>
                                    <button className='btn btn-danger' onClick={() => removeUser(bookedSlot.userEntityId)}
                                        style={{margin:'10px'}}>Удалить пользователя</button>
                                </td>
                            </tr>
                        )
                    ) : (
                        <tr>
                            <td>
                                <p className="text-center fs-5">У этой парковки нет бронирований.</p>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default ListParkingBookedSlotsComponent;
