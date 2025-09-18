const Message = require('../Models/MessageModel');
const { v4: uuidv4 } = require('uuid');

class MessageServices {
  // Get all messages for a specific flat
  static async getAllMessages(flatId) {
    try {
      const messages = await Message.find({ flatidM: flatId }).sort({ createdAt: 1 }); // Sort by creation date ascending
      return messages;
    } catch (error) {
      console.error('Error in MessageServices.getAllMessages:', error);
      throw new Error('Error retrieving messages from database');
    }
  }

  // Get messages for a specific user on a specific flat
  static async getUserMessages(flatId, senderId) {
    try {
      const messages = await Message.find({ 
        flatidM: flatId, 
        senderidM: senderId 
      }).sort({ createdAt: 1 }); // Sort by creation date ascending
      
      return messages;
    } catch (error) {
      console.error('Error in MessageServices.getUserMessages:', error);
      throw new Error('Error retrieving user messages from database');
    }
  }

  // Add new message
  static async addMessage(messageData) {
    try {
      // Generate unique ID for the message
      const messageId = uuidv4();

      // Create new message
      const newMessage = new Message({
        id: messageId,
        content: messageData.content,
        flatidM: messageData.flatId,
        senderidM: messageData.senderId,
        createdBy: messageData.senderId
      });

      const savedMessage = await newMessage.save();
      return savedMessage;
    } catch (error) {
      console.error('Error in MessageServices.addMessage:', error);
      throw new Error('Error creating message in database');
    }
  }

  // Get message by ID
  static async getMessageById(messageId) {
    try {
      const message = await Message.findOne({ id: messageId });
      return message;
    } catch (error) {
      console.error('Error in MessageServices.getMessageById:', error);
      throw new Error('Error retrieving message from database');
    }
  }

  // Delete message (optional - might be useful for moderation)
  static async deleteMessage(messageId) {
    try {
      const deletedMessage = await Message.findOneAndDelete({ id: messageId });
      return deletedMessage ? true : false;
    } catch (error) {
      console.error('Error in MessageServices.deleteMessage:', error);
      throw new Error('Error deleting message from database');
    }
  }

  // Get conversation between flat owner and a specific user
  static async getConversation(flatId, userId1, userId2) {
    try {
      const messages = await Message.find({
        flatidM: flatId,
        senderidM: { $in: [userId1, userId2] }
      }).sort({ createdAt: 1 });
      
      return messages;
    } catch (error) {
      console.error('Error in MessageServices.getConversation:', error);
      throw new Error('Error retrieving conversation from database');
    }
  }

  // Get all messages sent by a specific user (across all flats)
  static async getMessagesBySender(senderId) {
    try {
      const messages = await Message.find({ senderidM: senderId }).sort({ createdAt: -1 }); // Sort by creation date descending
      return messages;
    } catch (error) {
      console.error('Error in MessageServices.getMessagesBySender:', error);
      throw new Error('Error retrieving sender messages from database');
    }
  }

  // Get unique senders for a flat (useful for displaying list of users who sent messages)
  static async getUniqueSendersForFlat(flatId) {
    try {
      const uniqueSenders = await Message.distinct('senderidM', { flatidM: flatId });
      return uniqueSenders;
    } catch (error) {
      console.error('Error in MessageServices.getUniqueSendersForFlat:', error);
      throw new Error('Error retrieving unique senders from database');
    }
  }

  // Get message count for a flat
  static async getMessageCountForFlat(flatId) {
    try {
      const count = await Message.countDocuments({ flatidM: flatId });
      return count;
    } catch (error) {
      console.error('Error in MessageServices.getMessageCountForFlat:', error);
      throw new Error('Error counting messages from database');
    }
  }

  // Get latest message for a flat
  static async getLatestMessageForFlat(flatId) {
    try {
      const latestMessage = await Message.findOne({ flatidM: flatId }).sort({ createdAt: -1 });
      return latestMessage;
    } catch (error) {
      console.error('Error in MessageServices.getLatestMessageForFlat:', error);
      throw new Error('Error retrieving latest message from database');
    }
  }
}

module.exports = MessageServices;
