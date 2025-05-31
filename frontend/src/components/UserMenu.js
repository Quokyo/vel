import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../api/auth';
import axios from 'axios';

function UserMenu() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getCurrentUser().then(setUser);
  }, []);

  const handleLogout = async () => {
    await axios.post('http://localhost:5000/api/auth/logout', {}, { withCredentials: true });
    setUser(null);
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div style={{ color: 'white' }}>
      👋 {user.email}
      <button onClick={handleLogout} style={{
        marginLeft: 10, padding: '4px 10px', cursor: 'pointer'
      }}>Выйти</button>
    </div>
  );
}

export default UserMenu;
