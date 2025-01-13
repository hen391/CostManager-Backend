const Cost = require('../models/cost');
const User = require('../models/user');

// Add a new cost
exports.addCost = async (req, res) => {
    try {
        const { userId, description, sum, category, date } = req.body;

        if (!userId || !description || !sum || !category) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const newCost = new Cost({
            userId,
            description,
            sum,
            category,
            date: date ? new Date(date) : new Date(),
        });

        await newCost.save();
        res.status(201).json(newCost);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get monthly report
exports.getMonthlyReport = async (req, res) => {
    try {
        const { userId, month, year } = req.query;

        if (!userId || !month || !year) {
            return res.status(400).json({ error: 'userId, month, and year are required' });
        }

        const startDate = new Date(`${year}-${month}-01`);
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 1);

        const costs = await Cost.find({
            userId,
            date: { $gte: startDate, $lt: endDate },
        });

        res.json(costs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get user details
exports.getUserDetails = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findOne({ id });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const totalCost = await Cost.aggregate([
            { $match: { userId: id } },
            { $group: { _id: null, total: { $sum: '$sum' } } },
        ]);

        const total = totalCost.length > 0 ? totalCost[0].total : 0;

        res.json({
            first_name: user.first_name,
            last_name: user.last_name,
            id: user.id,
            total,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get developers info
exports.getDevelopers = (req, res) => {
    res.json([
        { first_name: 'Hen', last_name: 'Hazum' },
        { first_name: 'Yuval', last_name: 'Betito' },
    ]);
};
