import React from 'react'
import LogoutButton from './buttons/LogoutButton'

export const HeaderComponent = () => {
  return (
    <div>
        <header>
            <nav className='navbar navbar-dark bg-dark'>
                <a className="navbar-brand" href="#">BootPark</a>
                <LogoutButton/>
            </nav>
        </header>
    </div>
  )
}
