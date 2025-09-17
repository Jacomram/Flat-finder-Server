const mongoose = require('mongoose');
const { create } = require('./UserModel');

const MessageSchema = new mongoose.Schema({
    id: { type: String, required: true },
    content: { type: String, required: true },
    flatidM: { type: String, required: true },
    senderidM: { type: String, required: true },
    createdBy: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Message', MessageSchema);