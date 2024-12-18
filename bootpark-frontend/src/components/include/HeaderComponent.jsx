import React from 'react';
import { useLocation } from 'react-router-dom';
import LogoutButton from '../button/LogoutButton';
import ProfileButton from '../button/ProfileButton';
import RegisterButton from '../button/RegisterButton';
import LoginButton from '../button/LoginButton';

export const HeaderComponent = () => {
  const location = useLocation();

  return (
    <div>
      <header>
        <nav className="navbar navbar-dark bg-dark d-flex justify-content-between align-items-center px-3">
          <a className="navbar-brand" href="/" style={{ margin: "10px" }}>
            BootPark
          </a>
          <div>
            {location.pathname === '/register' && <LoginButton />}
            {location.pathname === '/login' && <RegisterButton />}
            {location.pathname !== '/login' && location.pathname !== '/register' && (
              <>
                <ProfileButton />
                <LogoutButton />
              </>
            )}
          </div>
        </nav>
      </header>
    </div>
  );
};