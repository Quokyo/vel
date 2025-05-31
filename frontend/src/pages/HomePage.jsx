import React, { useEffect, useState } from 'react';
import axios from 'axios';

const HomePage = () => {
  const [records, setRecords] = useState([]);
  const [newRecord, setNewRecord] = useState({
    title: '',
    artist: '',
    releaseDate: '',
    price: '',
    coverUrl: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({
    title: '',
    artist: '',
    releaseDate: '',
    price: '',
    coverUrl: '',
  });

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  const fetchRecords = async () => {
    const res = await axios.get('/api/records');
    setRecords(res.data);
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/records', newRecord, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewRecord({ title: '', artist: '', releaseDate: '', price: '', coverUrl: '' });
      fetchRecords();
    } catch (err) {
      console.error('Ошибка при добавлении:', err);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/records/${editingId}`, editData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchRecords();
      setEditingId(null);
    } catch (err) {
      console.error('Ошибка при редактировании:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Точно удалить пластинку?')) return;
    try {
      await axios.delete(`/api/records/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchRecords();
    } catch (err) {
      console.error('Ошибка при удалении:', err);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Каталог пластинок</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
        {records.map((record) => (
          <div key={record.id} style={{ border: '1px solid #ccc', padding: 10, width: 200 }}>
            <img src={record.coverUrl} alt={record.title} style={{ width: '100%', height: 150, objectFit: 'cover' }} />
            <h4>{record.title}</h4>
            <p>{record.artist}</p>
            <p>{record.releaseDate?.slice(0, 10)}</p>
            <p>{record.price} ₽</p>
            {user?.role === 'admin' && (
              <>
                <button onClick={() => {
                  setEditingId(record.id);
                  setEditData({
                    title: record.title,
                    artist: record.artist,
                    releaseDate: record.releaseDate?.slice(0, 10),
                    price: record.price,
                    coverUrl: record.coverUrl || '',
                  });
                }}>✏️</button>
                <button onClick={() => handleDelete(record.id)}>🗑️</button>
              </>
            )}
          </div>
        ))}
      </div>

      {user?.role === 'admin' && (
        <form onSubmit={handleAdd} style={{ marginTop: 20 }}>
          <h3>Добавить пластинку</h3>
          <input value={newRecord.title} onChange={(e) => setNewRecord({ ...newRecord, title: e.target.value })} placeholder="Название" required />
          <input value={newRecord.artist} onChange={(e) => setNewRecord({ ...newRecord, artist: e.target.value })} placeholder="Исполнитель" required />
          <input value={newRecord.releaseDate} onChange={(e) => setNewRecord({ ...newRecord, releaseDate: e.target.value })} type="date" required />
          <input value={newRecord.price} onChange={(e) => setNewRecord({ ...newRecord, price: e.target.value })} placeholder="Цена" type="number" required />
          <input value={newRecord.coverUrl} onChange={(e) => setNewRecord({ ...newRecord, coverUrl: e.target.value })} placeholder="Ссылка на обложку" />
          <button type="submit">Добавить</button>
        </form>
      )}

      {editingId && (
        <form onSubmit={handleEdit} style={{ marginTop: 20 }}>
          <h3>Редактировать пластинку</h3>
          <input value={editData.title} onChange={(e) => setEditData({ ...editData, title: e.target.value })} placeholder="Название" required />
          <input value={editData.artist} onChange={(e) => setEditData({ ...editData, artist: e.target.value })} placeholder="Исполнитель" required />
          <input value={editData.releaseDate} onChange={(e) => setEditData({ ...editData, releaseDate: e.target.value })} type="date" required />
          <input value={editData.price} onChange={(e) => setEditData({ ...editData, price: e.target.value })} placeholder="Цена" type="number" required />
          <input value={editData.coverUrl} onChange={(e) => setEditData({ ...editData, coverUrl: e.target.value })} placeholder="Ссылка на обложку" />
          <button type="submit">Сохранить</button>
          <button type="button" onClick={() => setEditingId(null)}>Отмена</button>
        </form>
      )}
    </div>
  );
};

export default HomePage;
