const MessageServices = require('../Services/MessageServices');

class MessageController {
  // GET /flats/:id/messages - Flat owner only
  static async getAllMessages(req, res) {
    try {
      const { id } = req.params; // flatId
      const messages = await MessageServices.getAllMessages(id);
      res.status(200).json(messages);
    } catch (error) {
      console.error('Error getting all messages:', error);
      res.status(500).json({ message: 'Error retrieving messages' });
    }
  }

  // GET /flats/:id/messages/:senderId - The sender only
  static async getUserMessages(req, res) {
    try {
      const { id, senderId } = req.params; // flatId, senderId
      const messages = await MessageServices.getUserMessages(id, senderId);
      res.status(200).json(messages);
    } catch (error) {
      console.error('Error getting user messages:', error);
      res.status(500).json({ message: 'Error retrieving user messages' });
    }
  }

  // POST /flats/:id/messages - Authenticated users
  static async addMessage(req, res) {
    try {
      const { id } = req.params; // flatId
      const messageData = req.body;
      
      // Add the current user as the sender
      messageData.senderId = req.user.id;
      messageData.flatId = id;
      
      const newMessage = await MessageServices.addMessage(messageData);
      
      res.status(201).json({
        message: 'Message sent successfully',
        messageData: newMessage
      });
    } catch (error) {
      console.error('Error sending message:', error);
      res.status(500).json({ message: 'Error sending message' });
    }
  }
}

module.exports = MessageController;
