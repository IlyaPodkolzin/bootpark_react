import React from 'react'
import LogoutButton from '../button/LogoutButton'
import ProfileButton from '../button/ProfileButton'

export const HeaderComponent = () => {
  return (
    <div>
        <header>
            <nav className='navbar navbar-dark bg-dark'>
                <a className="navbar-brand" href="/">BootPark</a>
                <ProfileButton/>
                <LogoutButton/>
            </nav>
        </header>
    </div>
  )
}
