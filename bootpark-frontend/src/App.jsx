import { useState } from 'react'
import './App.css'
import ListParkingComponent from './components/ListParkingComponent'
import { HeaderComponent } from './components/HeaderComponent'
import FooterComponent from './components/FooterComponent'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import ParkingComponent from './components/ParkingComponent'
import LoginComponent from './components/LoginComponent'
import ProtectedRoute from './components/route/ProtectedRoute'
import { Navigate } from 'react-router-dom'

function App() {

  return (
    <>
      <BrowserRouter>
        <HeaderComponent/>
        <Routes>

          {/* // http://localhost:4000/login */}
          <Route path='/login' element= { <LoginComponent/>}/>

          {/* // http://localhost:4000 */}
          <Route path='/' element = { <ProtectedRoute><ListParkingComponent/></ProtectedRoute> }/>
          {/* // http://localhost:4000/parkings */}
          <Route path='/parkings' element = { <ProtectedRoute><ListParkingComponent/></ProtectedRoute> }/>
          {/* // http://localhost:4000/add-parking */}
          <Route path='/add-parking' element = { <ProtectedRoute isAdminPage={true}><ParkingComponent/></ProtectedRoute> }/>
          {/* // http://localhost:4000/update-parking/{id} */}
          <Route path='/update-parking/:id' element = { <ProtectedRoute isAdminPage={true}><ParkingComponent/></ProtectedRoute> }/>
        

          {/* Перенаправление всех неизвестных маршрутов на логин */}
          <Route path="*" element={<Navigate to="/login" replace />} />

        </Routes>
        <FooterComponent/>
      </BrowserRouter>
    </>
  )
}

export default App
