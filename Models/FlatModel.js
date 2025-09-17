const mongoose = require('mongoose');

const FlatSchema = new mongoose.Schema({
    id: { type: String, required: true },
    city: { type: String, required: true },
    streetname: { type: String, required: true },
    streetnumber: { type: String, required: true },
    areasize: { type: Number, required: true },
    hasAc: { type: Boolean, default: false },
    yearofbuild: { type: Number, required: true },
    rent: { type: Number, required: true },
    dateavailable: { type: Date, required: true },
    ownerid: { type: String, required: true },
    createdBy: { type: String, required: true },
    updatedBy: { type: String, default: "" }
}, { timestamps: true });

module.exports = mongoose.model('Flat', FlatSchema);
