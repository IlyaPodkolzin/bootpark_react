import './App.css'
import ListParkingComponent from './components/page/ListParkingComponent'
import { HeaderComponent } from './components/include/HeaderComponent'
import FooterComponent from './components/include/FooterComponent'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import ParkingComponent from './components/page/ParkingComponent'
import LoginComponent from './components/page/LoginComponent'
import ProtectedRoute from './components/route/ProtectedRoute'
import ProfileComponent from './components/page/ProfileComponent'
import { Navigate } from 'react-router-dom'
import ListParkingBookedSlotsComponent from './components/page/ListParkingBookedSlotsComponent'
import RegisterComponent from './components/page/RegisterComponent'

function App() {

  return (
    <>
      <BrowserRouter>
        <HeaderComponent/>
        <Routes>

          {/* // http://localhost:4000/login */}
          <Route path='/login' element= { <LoginComponent/>}/>

          {/* // http://localhost:4000/register */}
          <Route path='/register' element= { <RegisterComponent/>}/>

          {/* // http://localhost:4000 */}
          <Route path='/' element = { <ProtectedRoute><ListParkingComponent/></ProtectedRoute> }/>
          {/* // http://localhost:4000/parkings */}
          <Route path='/parkings' element = { <ProtectedRoute><ListParkingComponent/></ProtectedRoute> }/>
          {/* // http://localhost:4000/parkings/{id} */}
          <Route path='/parkings/:parkingId' element = { <ProtectedRoute><ListParkingBookedSlotsComponent/></ProtectedRoute> }/>
          {/* // http://localhost:4000/add-parking */}
          <Route path='/add-parking' element = { <ProtectedRoute isAdminPage={true}><ParkingComponent/></ProtectedRoute> }/>
          {/* // http://localhost:4000/update-parking/{id} */}
          <Route path='/update-parking/:id' element = { <ProtectedRoute isAdminPage={true}><ParkingComponent/></ProtectedRoute> }/>
          
          {/* // http://localhost:4000/update-parking/{id} */}
          <Route path='/user_info' element = { <ProtectedRoute><ProfileComponent/></ProtectedRoute> }/>

          {/* Перенаправление всех неизвестных маршрутов на главную страницу */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
        <FooterComponent/>
      </BrowserRouter>
    </>
  )
}

export default App
