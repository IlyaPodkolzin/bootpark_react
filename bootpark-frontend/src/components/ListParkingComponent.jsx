import React, {useEffect, useState} from 'react'
import { deleteParking, listParkings, updateParking, updateParkingAvailableSlotsOnly } from '../services/ParkingService'
import { useNavigate } from 'react-router-dom'
import AdminOnly from './wrapper/AdminOnlyWrapper';
import { createBookedSlot } from '../services/BookedSlotService';

// Если зашел администратор - нужно отобразить все кнопки, иначе только кнопку "Забронировать"
function ListParkingComponent() {

    const [parkings, setParkings] = useState([])
    const [bookingErrors, setBookingErrors] = useState({}); // Состояние для хранения ошибок
    const navigator = useNavigate();

    useEffect(() => {
        getAllParkings();
    }, [])

    function getAllParkings() {
        listParkings().then((response) => {
            const sortedParkings = response.data.sort((a, b) => a.name.localeCompare(b.name)); // Сортировка
            setParkings(sortedParkings);
        }).catch(error => {
            console.error(error);
        })
    }

    function addNewParking() {
        navigator('/add-parking')
    }

    function updateParkingThenNavigate(id) {
        navigator(`/update-parking/${id}`)
    }

    function removeParking(id) {
        console.log(id);
        deleteParking(id).then((response) => {
            getAllParkings();
        }).catch(error => {
            console.error(error);
        });
    }

    function bookParking(parkingId, parkingAvailableSlotsAmount) {
       
        const now = new Date(); // Текущая дата
        now.setDate(now.getDate() + 2); // Добавляем 1 день
        const dateOfEnd = now.toISOString();
        
        const userEntityId = localStorage.getItem("user_id");
        
        const bookedSlot = {parkingId, userEntityId, dateOfEnd}
        createBookedSlot(bookedSlot)
        .then(() => {  // если добавление успешно - уменьшаем количество свободных мест
            console.log(userEntityId, parkingId);

            updateParkingAvailableSlotsOnly(parkingId, parkingAvailableSlotsAmount - 1)
            .then((response) => {
                    console.log(response.data);
                    getAllParkings();
        })
        })
        .catch(error => {  // иначе добавляем ошибку для данной парковки, что у данного пользователя уже есть место на этой парковке
            console.error(error);
            // Обновляем состояние ошибок для этой парковки
            setBookingErrors((prevErrors) => ({
                ...prevErrors,
                [parkingId]: 'Место на парковке уже забронировано.',
            }));
        })
    }

  return (
    <div className='container'>
        <h2 className='text-center'>Список доступных парковок</h2>
        <AdminOnly>
            <button className='btn btn-primary mb-2' onClick={addNewParking}>Добавить парковку</button>
        </AdminOnly>
        <table className='table table-striped table-bordered'>
            <thead>
                <tr>
                    <th>Название</th>
                    <th>Адрес</th>
                    <th>Количество свободных мест</th>
                    <AdminOnly>
                        <th>Действия</th>
                    </AdminOnly>
                    <th>Забронировать</th>
                </tr>
            </thead>
            <tbody>
                {
                    parkings.map(parking =>
                        <tr key={parking.id}>
                            <td>{parking.name}</td>
                            <td>{parking.address}</td>
                            <td>{parking.availableSlotsAmount}/{parking.parkingSlotsAmount}</td>
                            <AdminOnly>
                            <td>
                                <button className='btn btn-info' onClick={() => updateParkingThenNavigate(parking.id)}>Изменить</button>
                                <button className='btn btn-danger' onClick={() => removeParking(parking.id)}
                                    style={{margin:'10px'}}>Удалить</button>
                            </td>
                            </AdminOnly>
                            <td>
                                <button
                                    className='btn btn-success'
                                    disabled={parking.availableSlotsAmount === 0 || bookingErrors[parking.id]}  // Кнопка деактивируется, если нет свободных мест или пользователь уже имеет активную бронь
                                    onClick={() => bookParking(parking.id, parking.availableSlotsAmount)}>
                                        Забронировать
                                </button>
                                {bookingErrors[parking.id] && (
                                    <div style={{ color: 'green', marginTop: '5px' }}>
                                        {bookingErrors[parking.id]}
                                    </div>
                                )}
                            </td>
                        </tr>
                    )
                }
            </tbody>
        </table>
    </div>
  )
}

export default ListParkingComponent