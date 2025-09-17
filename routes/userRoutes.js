const express = require('express');
const router = express.Router();
const UserController = require('../Controllers/UserController');
const { 
  requireLogin, 
  requireAdmin, 
  requireAdminOrOwner 
} = require('../middleware/auth');

// Public routes (no authentication required)
router.post('/login', UserController.login);
router.post('/register', UserController.register);

// Protected routes (require authentication)
router.get('/', requireLogin, requireAdmin, UserController.getAllUsers);
router.get('/:id', requireLogin, UserController.getUserById);
router.patch('/:id', requireLogin, requireAdminOrOwner, UserController.updateUser);
router.delete('/:id', requireLogin, requireAdminOrOwner, UserController.deleteUser);

module.exports = router;