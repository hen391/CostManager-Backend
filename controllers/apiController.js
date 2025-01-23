const Cost = require('../models/cost');
const User = require('../models/user');

//Add new user
exports.addUser = async (req, res) => {
    try {
        const { id, first_name, last_name, birthday, marital_status } = req.body;

        if (!id || !first_name || !last_name || !birthday || !marital_status) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const newUser = new User({ id, first_name, last_name, birthday, marital_status });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Add a new cost
exports.addCost = async (req, res) => {
    try {
        const { userId, description, sum, category, date } = req.body;

        // Validate input
        if (!userId || !description || !sum || !category) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Check if the user exists
        const userExists = await User.findOne({ id: userId });
        if (!userExists) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Create and save the new cost
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
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get monthly report
exports.getMonthlyReport = async (req, res) => {
    try {
        const { userId, month, year } = req.query;

        // Validate input
        if (!userId || !month || !year) {
            return res.status(400).json({ error: 'userId, month, and year are required' });
        }

        // Ensure valid month and year
        if (month < 1 || month > 12 || year < 1900 || year > new Date().getFullYear()) {
            return res.status(400).json({ error: 'Invalid month or year' });
        }

        const startDate = new Date(`${year}-${month}-01`);
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 1);

        // Find costs for the user within the date range
        const costs = await Cost.find({
            userId,
            date: { $gte: startDate, $lt: endDate },
        });

        res.json({ userId, costs });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get user details
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

        const total = totalCost.length > 0 ? totalCost[0].total : 0;

        // Return the user's details
        res.json({
            first_name: user.first_name,
            last_name: user.last_name,
            id: user.id,
            total,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get developers info
exports.getDevelopers = (req, res) => {
    res.json([
        { first_name: 'Hen', last_name: 'Hazum' },
        { first_name: 'Yuval', last_name: 'Betito' },
    ]);
};
