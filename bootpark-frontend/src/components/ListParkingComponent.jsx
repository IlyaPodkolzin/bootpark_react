import React, {useEffect, useState} from 'react'
import { deleteParking, listParkings } from '../services/ParkingService'
import { useNavigate } from 'react-router-dom'
import AdminOnly from './wrapper/AdminOnlyWrapper';
import { createBookedSlot } from '../services/BookedSlotService';

// если зашел админ - нужно отобразить все кнопки, иначе только кнопку "Забронировать"
function ListParkingComponent() {

    const [parkings, setParkings] = useState([])

    const navigator = useNavigate();

    useEffect(() => {
        getAllParkings();
    }, [])

    function getAllParkings() {
        listParkings().then((response) => {
            setParkings(response.data);
            console.log(response.data)
        }).catch(error => {
            console.error(error);
        })
    }

    function addNewParking() {
        navigator('/add-parking')
    }

    function updateParking(id) {
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

    function bookParking(parkingId) {
       
        const now = new Date(); // Текущая дата
        now.setDate(now.getDate() + 1); // Добавляем 1 день
        const dateOfEnd = now.toISOString();
        
        const userEntityId = localStorage.getItem("user_id");
        
        const bookedSlot = {parkingId, userEntityId, dateOfEnd}
        createBookedSlot(bookedSlot).catch(error => {
            console.error(error);
        })

        console.log(userEntityId, parkingId);
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
                                <button className='btn btn-info' onClick={() => updateParking(parking.id)}>Изменить</button>
                                <button className='btn btn-danger' onClick={() => removeParking(parking.id)}
                                    style={{margin:'10px'}}>Удалить</button>
                            </td>
                            </AdminOnly>
                            <td>
                                <button className='btn btn-success' onClick={() => bookParking(parking.id)}>Забронировать</button>
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