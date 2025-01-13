const mongoose = require('mongoose');

const CostSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    description: { type: String, required: true },
    sum: { type: Number, required: true },
    category: { type: String, required: true },
    date: { type: Date, required: true },
});

module.exports = mongoose.model('Cost', CostSchema);
