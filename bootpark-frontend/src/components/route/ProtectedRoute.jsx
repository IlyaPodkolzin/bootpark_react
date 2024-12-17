import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, isAdminPage }) => {
  // Пример: проверка, авторизован ли пользователь
  const isAuthenticated = localStorage.getItem('token'); // Проверка токена в локальном хранилище

  // Если пользователь не авторизован, перенаправляем на страницу логина
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const roles = localStorage.getItem('roles')

  if (isAdminPage && !roles.includes("ADMIN")) {
    return <Navigate to="/login" replace />;
  }

  // Если авторизован, рендерим дочерние компоненты
  return children;
};

export default ProtectedRoute;
