import { useNavigate } from 'react-router-dom';

const RegisterButton = () => {
  const navigate = useNavigate();

  const handleRegister = () => {
    navigate('/register'); // Перенаправляем на страницу регистрации
  };

  return <button className='btn btn-light' style={{margin: "10px"}} onClick={handleRegister}>Зарегистрироваться</button>;
};

export default RegisterButton;
