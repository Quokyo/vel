import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getCurrentUser } from '../api/auth';

function AdminPage() {
  const [records, setRecords] = useState([]);
  const [newRecord, setNewRecord] = useState({
    title: '',
    artist: '',
    releaseDate: '',
    price: '',
    coverUrl: ''
  });
  const [message, setMessage] = useState('');
  const [role, setRole] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const user = await getCurrentUser();
      if (user?.role !== 'admin') {
        setMessage('Доступ запрещён: только для админа');
        return;
      }

      setRole(user.role);

      try {
        const response = await axios.get('http://localhost:5000/api/records', {
          withCredentials: true
        });
        setRecords(response.data);
      } catch (error) {
        setMessage('Ошибка при загрузке записей');
      }
    };

    fetchData();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/records', newRecord, {
        withCredentials: true
      });
      setRecords([...records, response.data]);
      setNewRecord({
        title: '',
        artist: '',
        releaseDate: '',
        price: '',
        coverUrl: ''
      });
      setMessage('Запись добавлена!');
    } catch (error) {
      setMessage('Ошибка при добавлении');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Админ-панель</h2>
      {message && <p>{message}</p>}

      {role === 'admin' && (
        <>
          <form onSubmit={handleAdd} style={{ marginBottom: '20px' }}>
            <h3>Добавить пластинку:</h3>
            <input placeholder="Название" value={newRecord.title} onChange={e => setNewRecord({ ...newRecord, title: e.target.value })} />
            <input placeholder="Исполнитель" value={newRecord.artist} onChange={e => setNewRecord({ ...newRecord, artist: e.target.value })} />
            <input placeholder="Дата релиза" type="date" value={newRecord.releaseDate} onChange={e => setNewRecord({ ...newRecord, releaseDate: e.target.value })} />
            <input placeholder="Цена" type="number" value={newRecord.price} onChange={e => setNewRecord({ ...newRecord, price: e.target.value })} />
            <input placeholder="Ссылка на обложку (необязательно)" value={newRecord.coverUrl} onChange={e => setNewRecord({ ...newRecord, coverUrl: e.target.value })} />
            <button type="submit">Добавить</button>
          </form>

          <h3>Список записей:</h3>
          <ul>
            {records.map(r => (
              <li key={r.id}>{r.title} — {r.artist} — {r.price}₽</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default AdminPage;
