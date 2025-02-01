const mongoose = require("mongoose");

const CostSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    description: { type: String, required: true },
    sum: { type: Number, required: true },
    category: {
        type: String,
        required: true,
        enum: ["food", "health", "housing", "sport", "education"],
    },
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Cost", CostSchema, "costs");
