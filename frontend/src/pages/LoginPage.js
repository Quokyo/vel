import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { getCurrentUser } from '../api/auth';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      }, {
        withCredentials: true
      });

      const user = await getCurrentUser();

      if (user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/records');
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Ошибка входа');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Вход</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button type="submit">Войти</button>
      </form>

      {message && <p>{message}</p>}

      <p style={{ marginTop: '10px' }}>
        Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
      </p>
    </div>
  );
}

export default LoginPage;
