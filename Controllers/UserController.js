const UserServices = require('../Services/UserServices');

class UserController {
  // GET /users - Admin only
  static async getAllUsers(req, res) {
    try {
      const users = await UserServices.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      console.error('Error getting all users:', error);
      res.status(500).json({ message: 'Error retrieving users' });
    }
  }

  // GET /users/:id - Authenticated users
  static async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await UserServices.getUserById(id);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.status(200).json(user);
    } catch (error) {
      console.error('Error getting user by ID:', error);
      res.status(500).json({ message: 'Error retrieving user' });
    }
  }

  // PATCH /users/:id - Admin or account owner
  static async updateUser(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const updatedUser = await UserServices.updateUser(id, updateData);
      
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.status(200).json(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ message: 'Error updating user' });
    }
  }

  // DELETE /users/:id - Admin or account owner
  static async deleteUser(req, res) {
    try {
      const { id } = req.params;
      
      const deleted = await UserServices.deleteUser(id);
      
      if (!deleted) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ message: 'Error deleting user' });
    }
  }

  // POST /users/login - Public
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }
      
      const result = await UserServices.login(email, password);
      
      if (!result.success) {
        return res.status(401).json({ message: result.message });
      }
      
      res.status(200).json({
        message: 'Login successful',
        user: result.user,
        token: result.token
      });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ message: 'Error during login' });
    }
  }

  // POST /users/register - Public
  static async register(req, res) {
    try {
      const userData = req.body;
      
      if (!userData.email || !userData.password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }
      
      const result = await UserServices.register(userData);
      
      if (!result.success) {
        return res.status(400).json({ message: result.message });
      }
      
      res.status(201).json({
        message: 'User registered successfully',
        user: result.user
      });
    } catch (error) {
      console.error('Error during registration:', error);
      res.status(500).json({ message: 'Error during registration' });
    }
  }
}

module.exports = UserController;
