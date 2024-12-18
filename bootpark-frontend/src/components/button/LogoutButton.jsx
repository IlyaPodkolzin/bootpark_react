import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // Удаляем токен
    localStorage.removeItem('username');
    localStorage.removeItem('roles');
    localStorage.removeItem('user_id');
    navigate('/login'); // Перенаправляем на страницу логина
  };

  return <button style={{margin: "10px"}} className='btn btn-light' onClick={handleLogout}>Выйти</button>;
};

export default LogoutButton;
