const mongoose = require('mongoose');

const deviceSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    device_id: { type: String, required: true },
    sim_number: { type: String, required: true },
    location: { type: String},
    is_assign: { type: Boolean, default:false },
    date: { type: Date, default: Date.now },
    tempareture_min: { type: Number },
    tempareture_max: { type: Number },
    humidity_min: { type: Number },
    humidity_max: { type: Number}
});

module.exports = mongoose.model('Device', deviceSchema);