const Flat = require('../Models/FlatModel');
const { v4: uuidv4 } = require('uuid');

class FlatServices {
  // Get all flats
  static async getAllFlats() {
    try {
      const flats = await Flat.find({});
      return flats;
    } catch (error) {
      console.error('Error in FlatServices.getAllFlats:', error);
      throw new Error('Error retrieving flats from database');
    }
  }

  // Get flat by ID
  static async getFlatById(flatId) {
    try {
      const flat = await Flat.findOne({ id: flatId });
      return flat;
    } catch (error) {
      console.error('Error in FlatServices.getFlatById:', error);
      throw new Error('Error retrieving flat from database');
    }
  }

  // Add new flat
  static async addFlat(flatData) {
    try {
      // Generate unique ID for the flat
      const flatId = uuidv4();
      
      // Create new flat with the provided data
      const newFlat = new Flat({
        id: flatId,
        city: flatData.city,
        streetname: flatData.streetname,
        streetnumber: flatData.streetnumber,
        areasize: flatData.areasize,
        hasAc: flatData.hasAc || false,
        yearofbuild: flatData.yearofbuild,
        rent: flatData.rent,
        dateavailable: new Date(flatData.dateavailable),
        ownerid: flatData.ownerId,
        createdBy: flatData.ownerId,
        updatedBy: ""
      });

      const savedFlat = await newFlat.save();
      return savedFlat;
    } catch (error) {
      console.error('Error in FlatServices.addFlat:', error);
      throw new Error('Error creating flat in database');
    }
  }

  // Update flat
  static async updateFlat(flatId, updateData) {
    try {
      // Remove fields that shouldn't be updated directly
      const allowedUpdates = {
        city: updateData.city,
        streetname: updateData.streetname,
        streetnumber: updateData.streetnumber,
        areasize: updateData.areasize,
        hasAc: updateData.hasAc,
        yearofbuild: updateData.yearofbuild,
        rent: updateData.rent,
        dateavailable: updateData.dateavailable ? new Date(updateData.dateavailable) : undefined,
        updatedBy: updateData.updatedBy || ""
      };

      // Remove undefined values
      Object.keys(allowedUpdates).forEach(key => {
        if (allowedUpdates[key] === undefined) {
          delete allowedUpdates[key];
        }
      });

      const updatedFlat = await Flat.findOneAndUpdate(
        { id: flatId },
        allowedUpdates,
        { new: true, runValidators: true }
      );

      return updatedFlat;
    } catch (error) {
      console.error('Error in FlatServices.updateFlat:', error);
      throw new Error('Error updating flat in database');
    }
  }

  // Delete flat
  static async deleteFlat(flatId) {
    try {
      const deletedFlat = await Flat.findOneAndDelete({ id: flatId });
      return deletedFlat ? true : false;
    } catch (error) {
      console.error('Error in FlatServices.deleteFlat:', error);
      throw new Error('Error deleting flat from database');
    }
  }

  // Get flats by owner ID
  static async getFlatsByOwnerId(ownerId) {
    try {
      const flats = await Flat.find({ ownerid: ownerId });
      return flats;
    } catch (error) {
      console.error('Error in FlatServices.getFlatsByOwnerId:', error);
      throw new Error('Error retrieving owner flats from database');
    }
  }

  // Search flats by criteria
  static async searchFlats(criteria) {
    try {
      const query = {};
      
      if (criteria.city) {
        query.city = { $regex: criteria.city, $options: 'i' };
      }
      if (criteria.minRent) {
        query.rent = { ...query.rent, $gte: criteria.minRent };
      }
      if (criteria.maxRent) {
        query.rent = { ...query.rent, $lte: criteria.maxRent };
      }
      if (criteria.minAreaSize) {
        query.areasize = { ...query.areasize, $gte: criteria.minAreaSize };
      }
      if (criteria.maxAreaSize) {
        query.areasize = { ...query.areasize, $lte: criteria.maxAreaSize };
      }
      if (criteria.hasAc !== undefined) {
        query.hasAc = criteria.hasAc;
      }
      if (criteria.availableFrom) {
        query.dateavailable = { $gte: new Date(criteria.availableFrom) };
      }

      const flats = await Flat.find(query);
      return flats;
    } catch (error) {
      console.error('Error in FlatServices.searchFlats:', error);
      throw new Error('Error searching flats in database');
    }
  }
}

module.exports = FlatServices;
