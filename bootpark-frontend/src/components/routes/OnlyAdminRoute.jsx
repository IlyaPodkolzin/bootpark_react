import React from 'react';
import { Navigate } from 'react-router-dom';

const OnlyAdminRoute = ({ children, isAdminPage }) => {
  // Проверка, является ли пользователь админом
  const roles = localStorage.getItem('roles'); // Проверка токена в локальном хранилище

  // Если пользователь не админ, перенаправляем на страницу логина
  if (!roles.includes("ADMIN")) {
    return <Navigate to="/login" replace />;
  }

  // Если админ, рендерим дочерние компоненты
  return children;
};

export default OnlyAdminRoute;
