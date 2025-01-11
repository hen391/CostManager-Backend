const Cost = require('../models/cost');
const User = require('../models/user');

// 📌 Add Cost Item
exports.addCost = async (req, res) => {
    try {
        const { userId, description, sum, category, date } = req.body;

        // Validate input
        if (!userId || !description || !sum || !category || !date) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Create a new cost item
        const newCost = new Cost({
            userId,
            description,
            sum,
            category,
            date,
        });

        await newCost.save();
        res.status(201).json(newCost);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

// 📌 Get Monthly Report
exports.getMonthlyReport = async (req, res) => {
    try {
        const { userId, month, year } = req.query;

        // Validate input
        if (!userId || !month || !year) {
            return res.status(400).json({ error: 'userId, month, and year are required' });
        }

        // Create the date range
        const startDate = new Date(`${year}-${month}-01`);
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 1);

        // Find costs within the date range (use .exec() to avoid type issues)
        const costs = await Cost.find({
            userId,
            date: { $gte: startDate, $lt: endDate },
        }).exec();

        res.json(costs);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

// 📌 Get User Details
exports.getUserDetails = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the user by ID
        const user = await User.findOne({ id });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Calculate the total cost for the user
        const totalCost = await Cost.aggregate([
            { $match: { userId: id } },
            { $group: { _id: null, total: { $sum: '$sum' } } },
        ]);

        // Ensure the aggregation result is not empty
        const totalCosts = totalCost.length > 0 ? totalCost[0].total : 0;

        // Return the user's details and total cost
        res.json({
            first_name: user.first_name,
            last_name: user.last_name,
            total_costs: totalCosts,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

// 📌 Get Developers Info
exports.getDevelopers = (req, res) => {
    res.json([
        { first_name: 'Hen', last_name: 'Hazum' },
        { first_name: 'Yuval', last_name: 'Betito' },
    ]);
};
