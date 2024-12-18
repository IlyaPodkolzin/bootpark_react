import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../config/AxiosConfig';

const RegisterComponent = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await apiClient.post('http://localhost:8001/api/auth/register', {
        username,
        password,
      });
      localStorage.setItem('token', response.data.accessToken); // Сохраняем токен
      localStorage.setItem('username', username);
      localStorage.setItem('roles', response.data.roles);
      localStorage.setItem('user_id', response.data.id);
      navigate('/'); // Перенаправление на защищённую страницу
    } catch (error) {
      alert('Ошибка регистрации. Попробуйте другое имя пользователя.');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body">
              <h1 className="text-center mb-4">Регистрация</h1>
              <form onSubmit={handleRegister}>
                <div className="mb-3">
                  <label className="form-label">Имя пользователя</label>
                  <input
                    type="text"
                    className="form-control"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Пароль</label>
                  <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-dark w-100">
                  Зарегистрироваться
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterComponent;
