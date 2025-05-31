import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import UserMenu from './UserMenu';
import { getCurrentUser } from '../api/auth';

function Layout({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    getCurrentUser().then(setUser);
  }, []);

  return (
    <>
      <header style={{
        padding: '10px 20px',
        background: '#1e1e1e',
        color: '#fff',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h2>Vellor</h2>
        <nav style={{ display: 'flex', gap: '15px' }}>
          <Link to="/" style={{ color: '#fff' }}>Главная</Link>
          <Link to="/records" style={{ color: '#fff' }}>Каталог</Link>
          {user?.role === 'admin' && <Link to="/admin" style={{ color: '#fff' }}>Админка</Link>}
          {!user && <>
            <Link to="/login" style={{ color: '#fff' }}>Вход</Link>
            <Link to="/register" style={{ color: '#fff' }}>Регистрация</Link>
          </>}
        </nav>
        <UserMenu />
      </header>
      <main style={{ padding: '20px' }}>
        {children}
      </main>
    </>
  );
}

export default Layout;
