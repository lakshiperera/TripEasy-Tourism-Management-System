const express = require('express');
const router = express.Router();
const {
  getAttractions,
  getAttraction,
  createAttraction,
  updateAttraction,
  deleteAttraction,
  getAttractionsForMap,
} = require('../controllers/attractionController');
const { protect } = require('../middleware/auth');

// Public routes
router.get('/', getAttractions);
router.get('/map', getAttractionsForMap);
router.get('/:id', getAttraction);

// Protected admin routes
router.post('/', protect, createAttraction);
router.put('/:id', protect, updateAttraction);
router.delete('/:id', protect, deleteAttraction);

module.exports = router;
