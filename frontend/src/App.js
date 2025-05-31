import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [records, setRecords] = useState([]);
  const [user, setUser] = useState(null);
  const [newRecord, setNewRecord] = useState({
    title: '',
    artist: '',
    releaseDate: '',
    price: '',
    coverUrl: ''
  });
  const [authData, setAuthData] = useState({ email: '', password: '' });
  const [isRegister, setIsRegister] = useState(false);
  const [message, setMessage] = useState('');

  const fetchRecords = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/records');
      setRecords(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUser = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/auth/me', { withCredentials: true });
      setUser(res.data);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    fetchRecords();
    fetchUser();
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    const url = isRegister ? '/register' : '/login';

    try {
      await axios.post(`http://localhost:5000/api/auth${url}`, authData, { withCredentials: true });
      fetchUser();
      setMessage('Успешно!');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Ошибка');
    }
  };

  const handleLogout = async () => {
    await axios.post('http://localhost:5000/api/auth/logout', {}, { withCredentials: true });
    setUser(null);
  };

  const handleAddRecord = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/records', newRecord, { withCredentials: true });
      setRecords([...records, res.data]);
      setNewRecord({ title: '', artist: '', releaseDate: '', price: '', coverUrl: '' });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <header>
        <div className="container">
          <h1>Vellor</h1>
          <nav>
            {user ? (
              <>
                <span>👋 {user.email}</span>
                <button onClick={handleLogout}>Выйти</button>
              </>
            ) : (
              <>
                <button onClick={() => setIsRegister(false)}>Вход</button>
                <button onClick={() => setIsRegister(true)}>Регистрация</button>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="container">
        <section>
          <h2>Каталог пластинок</h2>
          <div className="cards-grid">
            {records.map((r) => (
              <div key={r.id} className="card">
                <img
                  src={r.coverUrl || 'https://via.placeholder.com/200'}
                  alt={r.title}
                />
                <h4>{r.title}</h4>
                <p>{r.artist}</p>
                <strong>{r.price} ₽</strong>
                <p style={{ fontSize: '12px', color: '#ccc' }}>
                  {new Date(r.releaseDate).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </section>

        {user?.role === 'admin' && (
          <section>
            <h3>Добавить пластинку</h3>
            <form onSubmit={handleAddRecord}>
              <input
                placeholder="Название"
                value={newRecord.title}
                onChange={(e) => setNewRecord({ ...newRecord, title: e.target.value })}
              />
              <input
                placeholder="Исполнитель"
                value={newRecord.artist}
                onChange={(e) => setNewRecord({ ...newRecord, artist: e.target.value })}
              />
              <input
                type="date"
                value={newRecord.releaseDate}
                onChange={(e) => setNewRecord({ ...newRecord, releaseDate: e.target.value })}
              />
              <input
                type="number"
                placeholder="Цена"
                value={newRecord.price}
                onChange={(e) => setNewRecord({ ...newRecord, price: e.target.value })}
              />
              <input
                placeholder="URL обложки"
                value={newRecord.coverUrl}
                onChange={(e) => setNewRecord({ ...newRecord, coverUrl: e.target.value })}
              />
              <button type="submit">Добавить</button>
            </form>
          </section>
        )}

        {!user && (
          <section>
            <h3>{isRegister ? 'Регистрация' : 'Вход'}</h3>
            <form onSubmit={handleAuth}>
              <input
                type="email"
                placeholder="Email"
                value={authData.email}
                onChange={(e) => setAuthData({ ...authData, email: e.target.value })}
              />
              <input
                type="password"
                placeholder="Пароль"
                value={authData.password}
                onChange={(e) => setAuthData({ ...authData, password: e.target.value })}
              />
              <button type="submit">{isRegister ? 'Зарегистрироваться' : 'Войти'}</button>
            </form>
            {message && <p>{message}</p>}
          </section>
        )}
      </main>

      <footer>
        © 2025 Vellor. Все права защищены.
      </footer>
    </div>
  );
}

export default App;
