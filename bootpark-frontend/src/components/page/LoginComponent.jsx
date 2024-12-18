import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../config/AxiosConfig';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
        const response = await apiClient.post('http://localhost:8001/api/auth/login',
            {username, password}
        );
        localStorage.setItem('token', response.data.accessToken); // Сохраняем токен
        localStorage.setItem('username', username);
        localStorage.setItem('roles', response.data.roles);
        localStorage.setItem('user_id', response.data.id);
        navigate('/'); // Перенаправление на защищённую страницу
    } catch (error) {
        alert('Неверные имя пользователя или пароль');
    }
  };

  return (
    <div>
      <h1>Вход</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label>Имя пользователя:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Пароль:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Войти</button>
      </form>
    </div>
  );
};

export default LoginPage;
