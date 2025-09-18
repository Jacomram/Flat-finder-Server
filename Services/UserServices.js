const User = require('../Models/UserModel');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class UserServices {
  // Get all users
  static async getAllUsers() {
    try {
      const users = await User.find({}).select('-password'); // Exclude password from response
      return users;
    } catch (error) {
      console.error('Error in UserServices.getAllUsers:', error);
      throw new Error('Error retrieving users from database');
    }
  }

  // Get user by ID
  static async getUserById(userId) {
    try {
      const user = await User.findOne({ id: userId }).select('-password');
      return user;
    } catch (error) {
      console.error('Error in UserServices.getUserById:', error);
      throw new Error('Error retrieving user from database');
    }
  }

  // Update user
  static async updateUser(userId, updateData) {
    try {
      // Remove fields that shouldn't be updated directly
      const allowedUpdates = {
        email: updateData.email,
        firstName: updateData.firstName,
        lastName: updateData.lastName,
        birthDate: updateData.birthDate ? new Date(updateData.birthDate) : undefined,
        favouriteFlats: updateData.favouriteFlats,
        createFlats: updateData.createFlats,
        updatedFlats: updateData.updatedFlats
      };

      // Remove undefined values
      Object.keys(allowedUpdates).forEach(key => {
        if (allowedUpdates[key] === undefined) {
          delete allowedUpdates[key];
        }
      });

      // If password is being updated, hash it
      if (updateData.password) {
        allowedUpdates.password = await bcrypt.hash(updateData.password, 10);
      }

      const updatedUser = await User.findOneAndUpdate(
        { id: userId },
        allowedUpdates,
        { new: true, runValidators: true }
      ).select('-password');

      return updatedUser;
    } catch (error) {
      console.error('Error in UserServices.updateUser:', error);
      throw new Error('Error updating user in database');
    }
  }

  // Delete user
  static async deleteUser(userId) {
    try {
      const deletedUser = await User.findOneAndDelete({ id: userId });
      return deletedUser ? true : false;
    } catch (error) {
      console.error('Error in UserServices.deleteUser:', error);
      throw new Error('Error deleting user from database');
    }
  }

  // User login
  static async login(email, password) {
    try {
      // Find user by email
      const user = await User.findOne({ email: email });
      
      if (!user) {
        return {
          success: false,
          message: 'Invalid email or password'
        };
      }

      // TODO: Uncomment when bcrypt is installed
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return {
          success: false,
          message: 'Invalid email or password'
        };
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          id: user.id, 
          email: user.email,
          role: user.Admin ? 'admin' : 'user'
        },
        process.env.JWT_SECRET || 'fallback_secret',
        { expiresIn: '24h' }
      );

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          Admin: user.Admin
        },
        token: token
      };
    } catch (error) {
      console.error('Error in UserServices.login:', error);
      throw new Error('Error during login process');
    }
  }

  // User registration
  static async register(userData) {
    try {
      // Validate required fields
      if (!userData.email || !userData.password || !userData.firstName || !userData.lastName || !userData.birthDate) {
        return {
          success: false,
          message: 'All fields are required: email, password, firstName, lastName, and birthDate'
        };
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userData.email)) {
        return {
          success: false,
          message: 'Please enter a valid email address'
        };
      }

      // Validate password length
      if (userData.password.length < 6) {
        return {
          success: false,
          message: 'Password must be at least 6 characters long'
        };
      }

      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      
      if (existingUser) {
        return {
          success: false,
          message: 'User with this email already exists'
        };
      }

      // Generate unique ID for the user
      const userId = uuidv4();

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      // Create new user
      const newUser = new User({
        id: userId,
        email: userData.email,
        password: hashedPassword,
        firstName: userData.firstName,
        lastName: userData.lastName,
        birthDate: new Date(userData.birthDate),
        Admin: userData.Admin || false,
        favouriteFlats: userData.favouriteFlats || [],
        createFlats: userData.createFlats || [],
        updatedFlats: userData.updatedFlats || []
      });

      const savedUser = await newUser.save();

      return {
        success: true,
        user: {
          id: savedUser.id,
          email: savedUser.email,
          firstName: savedUser.firstName,
          lastName: savedUser.lastName,
          Admin: savedUser.Admin
        }
      };
    } catch (error) {
      console.error('Error in UserServices.register:', error);
      if (error.code === 11000) {
        return {
          success: false,
          message: 'User with this email already exists'
        };
      }
      throw new Error('Error during registration process');
    }
  }

  // Get user by email (helper method)
  static async getUserByEmail(email) {
    try {
      const user = await User.findOne({ email: email });
      return user;
    } catch (error) {
      console.error('Error in UserServices.getUserByEmail:', error);
      throw new Error('Error retrieving user by email from database');
    }
  }

  // Add flat to user's favorites
  static async addToFavorites(userId, flatId) {
    try {
      const user = await User.findOneAndUpdate(
        { id: userId },
        { $addToSet: { favouriteFlats: flatId } }, // $addToSet prevents duplicates
        { new: true }
      ).select('-password');

      return user;
    } catch (error) {
      console.error('Error in UserServices.addToFavorites:', error);
      throw new Error('Error adding flat to favorites');
    }
  }

  // Remove flat from user's favorites
  static async removeFromFavorites(userId, flatId) {
    try {
      const user = await User.findOneAndUpdate(
        { id: userId },
        { $pull: { favouriteFlats: flatId } },
        { new: true }
      ).select('-password');

      return user;
    } catch (error) {
      console.error('Error in UserServices.removeFromFavorites:', error);
      throw new Error('Error removing flat from favorites');
    }
  }
}

module.exports = UserServices;
