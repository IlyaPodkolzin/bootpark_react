import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // Удаляем токен
    localStorage.removeItem('username');
    localStorage.removeItem('roles');
    navigate('/login'); // Перенаправляем на страницу логина
  };

  return <button onClick={handleLogout}>Выйти</button>;
};

export default LogoutButton;
