const express = require('express');
const router = express.Router();
const MessageController = require('../Controllers/MessageController');
const { 
  requireLogin, 
  requireFlatOwner, 
  requireMessageSender 
} = require('../middleware/auth');

// Message routes are nested under /flats/:id/messages
// All message routes require authentication
router.get('/:id/messages', requireLogin, requireFlatOwner, MessageController.getAllMessages);
router.get('/:id/messages/:senderId', requireLogin, requireMessageSender, MessageController.getUserMessages);
router.post('/:id/messages', requireLogin, MessageController.addMessage);

module.exports = router;