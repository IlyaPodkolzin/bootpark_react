import { useNavigate } from 'react-router-dom';

const ProfileButton = () => {
  const navigate = useNavigate();

  const handleProfile = () => {
    navigate('/user_info'); // Перенаправляем на страницу логина
  };

  return <button style={{margin: "10px"}} className='btn btn-light' onClick={handleProfile}>Личный кабинет</button>;
};

export default ProfileButton;
