import { useNavigate } from 'react-router-dom';

const ProfileButton = () => {
  const navigate = useNavigate();

  const handleProfile = () => {
    navigate('/user_info'); // Перенаправляем на страницу логина
  };

  return <button onClick={handleProfile}>Личный кабинет</button>;
};

export default ProfileButton;
