const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /records
exports.getAllRecords = async (req, res) => {
  try {
    const records = await prisma.record.findMany();
    res.json(records);
  } catch (error) {
    console.error('Ошибка получения записей:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// GET /records/:id
exports.getRecordById = async (req, res) => {
  const { id } = req.params;
  const record = await prisma.record.findUnique({ where: { id: Number(id) } });
  if (!record) return res.status(404).json({ message: 'Запись не найдена' });
  res.json(record);
};

// POST /records
exports.createRecord = async (req, res) => {
  try {
    const { title, artist, releaseDate, price, coverUrl } = req.body;

    if (!title || !artist || !releaseDate || !price) {
      return res.status(400).json({ message: 'Все поля, кроме coverUrl, обязательны' });
    }

    const newRecord = await prisma.record.create({
      data: {
        title,
        artist,
        releaseDate: new Date(releaseDate),
        price: parseFloat(price),
        coverUrl
      }
    });

    console.log('✅ Новая запись создана:', newRecord.title);
    res.status(201).json(newRecord);
  } catch (error) {
    console.error('❌ Ошибка при создании записи:', error);
    res.status(500).json({ message: 'Ошибка на сервере' });
  }
};

// PUT /records/:id
exports.updateRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, artist, releaseDate, price, coverUrl } = req.body;

    const updated = await prisma.record.update({
      where: { id: Number(id) },
      data: {
        title,
        artist,
        releaseDate: new Date(releaseDate),
        price: parseFloat(price),
        coverUrl
      }
    });

    console.log('✏️ Запись обновлена:', updated.title);
    res.json(updated);
  } catch (error) {
    console.error('❌ Ошибка при обновлении записи:', error);
    res.status(500).json({ message: 'Ошибка при обновлении' });
  }
};

// DELETE /records/:id
exports.deleteRecord = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.record.delete({ where: { id: Number(id) } });
    console.log('🗑️ Запись удалена:', id);
    res.status(204).end();
  } catch (error) {
    console.error('❌ Ошибка при удалении записи:', error);
    res.status(500).json({ message: 'Ошибка при удалении' });
  }
};
