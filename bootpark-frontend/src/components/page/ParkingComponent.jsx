import React, { useEffect, useState } from 'react'
import { createParking, getParking, updateParking } from '../../service/ParkingService'
import { useNavigate, useParams, Routes, Route, Link, Navigate } from 'react-router-dom'

const ParkingComponent = () => {

    const [name, setName] = useState('')
    const [address, setAddress] = useState('')
    const [availableSlotsAmount, setAvailableSlotsAmount] = useState('')
    const [parkingSlotsAmount, setParkingSlotsAmount] = useState('')
    const [initialParkingSlotsAmount, setInitialParkingSlotsAmount] = useState(null)  // для сохранения количества парковочных мест до изменения

    const {id} = useParams();
    const[errors, setErrors] = useState({
        name: '',
        address: '',
        parkingSlotsAmount: ''
    })

    const navigator = useNavigate();

    useEffect(() => {
        if (id) {
            getParking(id).then((response) => {
                setName(response.data.name);
                setAddress(response.data.address);
                setAvailableSlotsAmount(response.data.availableSlotsAmount);
                setParkingSlotsAmount(response.data.parkingSlotsAmount);
                setInitialParkingSlotsAmount(response.data.parkingSlotsAmount)
            }).catch(error => {
                console.error(error)
            })
        }
    }, [id])

    function saveOrUpdateParking(e) {
        e.preventDefault();

        if (validateForm()) {

            // Изначально все места свободны, следовательно availableSlotsAmount = parkingSlotsAmount (upd. НЕТ!!!!!! ТОЛЬКО ПРИ СОЗДАНИИ)
            const availableSlotsAmount = parkingSlotsAmount;
            const bookedSlotsIds = []; // пустой список забронированных мест (ведь парковка только создана, а сервер ожидает список броней)

            const parking = {name, address, availableSlotsAmount, parkingSlotsAmount, bookedSlotsIds}
            console.log(parking);

            if (id) {
                updateParking(id, parking).then((response) => {
                    console.log(response.data);
                    navigator('/parkings');
                }).catch(error => {
                    console.error(error)
                })
            }
            else {
                createParking(parking).then((response) => {
                    console.log(response.data);
                    navigator('/parkings');
                }).catch(error => {
                    console.error(error);
                })
            }
        }
    }

    function validateForm() {
        let valid = true;

        const errorsCopy = {... errors}

        if (!name.trim()) {
            errorsCopy.name = '\"Название\" обязательно для заполнения.';
            valid = false;
        } else {
            errorsCopy.name = null;
        }

        if (!address.trim()) {
            errorsCopy.address = '\"Адрес\" обязателен для заполнения.';
            valid = false;
        } else {
            errorsCopy.address = null;
        }

        if (!parkingSlotsAmount) {
            errorsCopy.parkingSlotsAmount = '\"Количество мест\" обязательно для заполнения.';
            valid = false;
        }
        else if (+parkingSlotsAmount <= 0) {
            errorsCopy.parkingSlotsAmount = '\"Количество мест\" должно быть больше 0.';
            valid = false;
        }
        else if (+parkingSlotsAmount > 9999) {
            errorsCopy.parkingSlotsAmount = '\"Количество мест\" должно быть меньше 9999.';
            valid = false;
        }
        else if (initialParkingSlotsAmount && availableSlotsAmount - (initialParkingSlotsAmount - +parkingSlotsAmount) < 0) {
            errorsCopy.parkingSlotsAmount = `\"Количество мест\" должно быть не меньше количества забронированных мест (${initialParkingSlotsAmount - availableSlotsAmount}).`;
            valid = false;
        } else {
            errorsCopy.parkingSlotsAmount = null
        }

        setErrors(errorsCopy);

        return valid;
    }

    function pageTitle() {
        if(id) {
            return <h2 className='text-center'>Изменить данные парковки</h2>
        }
        else {
            return <h2 className='text-center'>Добавить парковку</h2>
        }
    }

    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ marginTop: "30px" }}>
            <div className="card col-md-6 shadow">
                <div className="card-header bg-dark text-white text-center">
                <h3>{pageTitle()}</h3>
                </div>
                <div className="card-body">
                <form>
                    <div className="form-group mb-3">
                    <label className="form-label">Название:</label>
                    <input
                        type="text"
                        placeholder="Введите название парковки"
                        name="name"
                        value={name}
                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                        onChange={(e) => setName(e.target.value)}
                    />
                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                    </div>

                    <div className="form-group mb-3">
                    <label className="form-label">Адрес:</label>
                    <input
                        type="text"
                        placeholder="Введите адрес парковки"
                        name="address"
                        value={address}
                        className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                    {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                    </div>

                    <div className="form-group mb-3">
                    <label className="form-label">Вместимость:</label>
                    <input
                        type="number"
                        placeholder="Введите вместимость парковки"
                        name="parkingSlotsAmount"
                        value={parkingSlotsAmount}
                        className={`form-control ${errors.parkingSlotsAmount ? 'is-invalid' : ''}`}
                        onChange={(e) => setParkingSlotsAmount(e.target.value)}
                    />
                    {errors.parkingSlotsAmount && <div className="invalid-feedback">{errors.parkingSlotsAmount}</div>}
                    </div>

                    <div className="d-flex justify-content-center">
                    <button className="btn btn-success w-50" onClick={saveOrUpdateParking}>
                        Подтвердить
                    </button>
                    </div>
                </form>
                </div>
            </div>
        </div>
    )
}

export default ParkingComponent