const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    id: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    birthDate: { type: Date, required: true },
    Admin: { type: Boolean, default: false },
    favouriteFlats: { type: Array, default: [] },
    createFlats: { type: Array, default: [] },
    updatedFlats: { type: Array, default: [] }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);