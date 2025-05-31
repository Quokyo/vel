import React, { useEffect, useState } from 'react';
import axios from 'axios';

function RecordsPage() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/records');
        setRecords(res.data);
      } catch (error) {
        console.error('Ошибка при загрузке записей:', error);
      }
    };

    fetchRecords();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Каталог пластинок</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: '20px'
      }}>
        {records.map((record) => (
          <div
            key={record.id}
            style={{
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '10px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              background: '#fff'
            }}
          >
            <img
              src={record.coverUrl || 'https://via.placeholder.com/200x200.png?text=Обложка'}
              alt={record.title}
              style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '6px' }}
            />
            <h3 style={{ marginTop: '10px' }}>{record.title}</h3>
            <p>{record.artist}</p>
            <p><strong>{record.price} ₽</strong></p>
            <p style={{ fontSize: '12px', color: '#888' }}>
              {new Date(record.releaseDate).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecordsPage;
