const mongoose = require('mongoose');

const cmDataSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    device_id: { type: String, required: true },
    temperature: { type: Number, required: true },
    humidity: { type: Number, required: true },
    door_lock: { type: Number },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CMData', cmDataSchema);