const express = require('express');
const router = express.Router();

const {
  getAllRecords,
  getRecordById,
  createRecord,
  updateRecord,
  deleteRecord
} = require('../controllers/recordController');

const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');

// Public
router.get('/', getAllRecords);
router.get('/:id', getRecordById);

// Admin-only
router.post('/', auth, admin, createRecord);
router.put('/:id', auth, admin, updateRecord);
router.delete('/:id', auth, admin, deleteRecord);

module.exports = router;
