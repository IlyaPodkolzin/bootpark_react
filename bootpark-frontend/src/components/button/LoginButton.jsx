import { useNavigate } from 'react-router-dom';

const LoginButton = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login'); // Перенаправляем на страницу логина
  };

  return <button className='btn btn-light' style={{margin: "10px"}} onClick={handleLogin}>Войти</button>;
};

export default LoginButton;
