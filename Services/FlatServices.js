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
      // Validate required fields
      const requiredFields = ['city', 'streetname', 'streetnumber', 'areasize', 'yearofbuild', 'rent', 'dateavailable', 'ownerid'];
      const missingFields = requiredFields.filter(field => !flatData[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      // Validate and parse date
      let dateAvailable;
      if (flatData.dateavailable) {
        dateAvailable = new Date(flatData.dateavailable);
        if (isNaN(dateAvailable.getTime())) {
          throw new Error('Invalid date format for dateavailable. Please use a valid date format (e.g., YYYY-MM-DD or ISO 8601)');
        }
      } else {
        throw new Error('dateavailable field is required');
      }

      // Validate numeric fields
      if (isNaN(flatData.areasize) || flatData.areasize <= 0) {
        throw new Error('areasize must be a positive number');
      }
      if (isNaN(flatData.yearofbuild) || flatData.yearofbuild < 1800 || flatData.yearofbuild > new Date().getFullYear()) {
        throw new Error('yearofbuild must be a valid year');
      }
      if (isNaN(flatData.rent) || flatData.rent <= 0) {
        throw new Error('rent must be a positive number');
      }

      // Generate unique ID for the flat
      const flatId = uuidv4();
      
      // Create new flat with the provided data
      const newFlat = new Flat({
        id: flatId,
        city: flatData.city.trim(),
        streetname: flatData.streetname.trim(),
        streetnumber: flatData.streetnumber.trim(),
        areasize: Number(flatData.areasize),
        hasAc: Boolean(flatData.hasAc),
        yearofbuild: Number(flatData.yearofbuild),
        rent: Number(flatData.rent),
        dateavailable: dateAvailable,
        ownerid: flatData.ownerid,
        createdBy: flatData.ownerid,
        updatedBy: ""
      });

      const savedFlat = await newFlat.save();
      return savedFlat;
    } catch (error) {
      console.error('Error in FlatServices.addFlat:', error);
      throw new Error(`Error creating flat in database: ${error.message}`);
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
