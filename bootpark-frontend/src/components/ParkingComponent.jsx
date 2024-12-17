import React, { useEffect, useState } from 'react'
import { createParking, getParking, updateParking } from '../services/ParkingService'
import { useNavigate, useParams, Routes, Route, Link, Navigate } from 'react-router-dom'

const ParkingComponent = () => {

    const [name, setName] = useState('')
    const [address, setAddress] = useState('')
    const [parkingSlotsAmount, setParkingSlotsAmount] = useState('')

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
                setParkingSlotsAmount(response.data.parkingSlotsAmount);
            }).catch(error => {
                console.error(error)
            })
        }
    }, [id])

    function saveOrUpdateParking(e) {
        e.preventDefault();

        if (validateForm()) {

            // Изначально все места свободны, следовательно availableSlotsAmount = parkingSlotsAmount
            const availableSlotsAmount = parkingSlotsAmount;

            const parking = {name, address, availableSlotsAmount, parkingSlotsAmount}
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
        }

        if (!address.trim()) {
            errorsCopy.address = '\"Адрес\" обязателен для заполнения.';
            valid = false;
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
        <div className='container'>
            <br></br>
            <div className='row'>
                <div className='card col-md-6 offset-md-3 offset-md-3'>
                    {
                        pageTitle()
                    }
                    <div className='card-body'>
                        <form>

                            <div className='form-group mb-2'>
                                <label className='form-label'>Название: 
                                <input
                                    type='text'
                                    placeholder='Введите название парковки'
                                    name='name'
                                    value={name}
                                    className={`form-control ${ errors.name ? 'is-invalid': ''}`}
                                    onChange={(e) => setName(e.target.value)}
                                ></input>
                                { errors.name && <div className='invalid-feedback'> { errors.name} </div> }
                                </label>
                            </div>

                            <div className='form-group mb-2'>
                                <label className='form-label'>Адрес: 
                                <input
                                    type='text'
                                    placeholder='Введите адрес парковки'
                                    name='address'
                                    value={address}
                                    className={`form-control ${ errors.address ? 'is-invalid': ''}`}
                                    onChange={(e) => setAddress(e.target.value)}
                                ></input>
                                { errors.name && <div className='invalid-feedback'> { errors.address} </div> }
                                </label>
                            </div>

                            <div className='form-group mb-2'>
                                <label className='form-label'>Вместимость: 
                                <input
                                    type='number'
                                    placeholder='Введите вместимость парковки'
                                    name='parkingSlotsAmount'
                                    value={parkingSlotsAmount}
                                    className={`form-control ${ errors.parkingSlotsAmount ? 'is-invalid': ''}`}
                                    onChange={(e) => setParkingSlotsAmount(e.target.value)}
                                ></input>
                                { errors.name && <div className='invalid-feedback'> { errors.parkingSlotsAmount} </div> }
                                </label>
                            </div>

                            <button className='btn btn-success' onClick={saveOrUpdateParking}>Подтвердить</button>
                        </form>
                    </div>
                </div>
            </div>
            
        </div>
    )
}

export default ParkingComponent