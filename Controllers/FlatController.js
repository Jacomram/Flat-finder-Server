const FlatServices = require('../Services/FlatServices');

class FlatController {
  // GET /flats - Authenticated users
  static async getAllFlats(req, res) {
    try {
      const flats = await FlatServices.getAllFlats();
      res.status(200).json(flats);
    } catch (error) {
      console.error('Error getting all flats:', error);
      res.status(500).json({ message: 'Error retrieving flats' });
    }
  }

  // GET /flats/:id - Authenticated users
  static async getFlatById(req, res) {
    try {
      const { id } = req.params;
      const flat = await FlatServices.getFlatById(id);
      
      if (!flat) {
        return res.status(404).json({ message: 'Flat not found' });
      }
      
      res.status(200).json(flat);
    } catch (error) {
      console.error('Error getting flat by ID:', error);
      res.status(500).json({ message: 'Error retrieving flat' });
    }
  }

  // POST /flats - Authenticated users (flat owner)
  static async addFlat(req, res) {
    try {
      const flatData = req.body;
      
      // Add the current user as the owner
      flatData.ownerid = req.user.id;
      
      const newFlat = await FlatServices.addFlat(flatData);
      
      res.status(201).json({
        message: 'Flat created successfully',
        flat: newFlat
      });
    } catch (error) {
      console.error('Error creating flat:', error);
      
      // Check if it's a validation error
      if (error.message.includes('Missing required fields') || 
          error.message.includes('Invalid date format') || 
          error.message.includes('must be a positive number') ||
          error.message.includes('must be a valid year')) {
        return res.status(400).json({ 
          message: 'Validation error', 
          error: error.message.replace('Error creating flat in database: ', '')
        });
      }
      
      res.status(500).json({ message: 'Internal server error creating flat' });
    }
  }

  // PATCH /flats/:id - Flat owner only
  static async updateFlat(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const updatedFlat = await FlatServices.updateFlat(id, updateData);
      
      if (!updatedFlat) {
        return res.status(404).json({ message: 'Flat not found' });
      }
      
      res.status(200).json({
        message: 'Flat updated successfully',
        flat: updatedFlat
      });
    } catch (error) {
      console.error('Error updating flat:', error);
      res.status(500).json({ message: 'Error updating flat' });
    }
  }

  // DELETE /flats/:id - Flat owner only
  static async deleteFlat(req, res) {
    try {
      const { id } = req.params;
      
      const deleted = await FlatServices.deleteFlat(id);
      
      if (!deleted) {
        return res.status(404).json({ message: 'Flat not found' });
      }
      
      res.status(200).json({ message: 'Flat deleted successfully' });
    } catch (error) {
      console.error('Error deleting flat:', error);
      res.status(500).json({ message: 'Error deleting flat' });
    }
  }
}

module.exports = FlatController;
