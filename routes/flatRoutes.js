const express = require('express');
const router = express.Router();
const FlatController = require('../Controllers/FlatController');
const { 
  requireLogin, 
  requireFlatOwner 
} = require('../middleware/auth');

// All flat routes require authentication
router.get('/', requireLogin, FlatController.getAllFlats);
router.get('/:id', requireLogin, FlatController.getFlatById);
router.post('/', requireLogin, FlatController.addFlat);
router.patch('/:id', requireLogin, requireFlatOwner, FlatController.updateFlat);
router.delete('/:id', requireLogin, requireFlatOwner, FlatController.deleteFlat);

module.exports = router;