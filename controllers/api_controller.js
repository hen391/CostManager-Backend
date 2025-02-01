const Cost = require("../models/cost");
const User = require("../models/user");

// Add a New User
exports.addUser = async (req, res) => {
  try {
    const { id, first_name, last_name, birthday, marital_status } = req.body;

    // Validate input
    if (!id || !first_name || !last_name || !birthday || !marital_status) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ id });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Create new user
    const newUser = new User({
      id,
      first_name,
      last_name,
      birthday: new Date(birthday), // Ensure it's a valid date
      marital_status,
    });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add Cost Item
exports.addCost = async (req, res) => {
  try {
    const { userId, description, sum, category, date } = req.body;

    if (!userId || !description || !sum || !category) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (
      !["food", "health", "housing", "sport", "education"].includes(category)
    ) {
      return res
        .status(400)
        .json({
          error: `Invalid category. Allowed categories: food, health, housing, sport, education.`,
        });
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
    console.error("Server Error:", err);

    // ✅ Catch validation errors and return 400 instead of 500
    if (err.name === "ValidationError") {
      return res.status(400).json({ error: err.message });
    }

    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get Monthly Report (Grouped by Category)
exports.getMonthlyReport = async (req, res) => {
  try {
    const { userId, month, year } = req.query;

    if (!userId || !month || !year) {
      return res
        .status(400)
        .json({ error: "userId, month, and year are required" });
    }

    const startDate = new Date(`${year}-${month}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    // ✅ Aggregate query to group costs by category
    const costs = await Cost.aggregate([
      { $match: { userId, date: { $gte: startDate, $lt: endDate } } },
      {
        $group: {
          _id: "$category",
          costs: {
            $push: {
              sum: "$sum",
              description: "$description",
              day: { $dayOfMonth: "$date" },
            },
          },
        },
      },
    ]);

    const response = {
      userid: userId,
      year: parseInt(year),
      month: parseInt(month),
      costs: costs.reduce((acc, item) => {
        acc.push({ [item._id]: item.costs });
        return acc;
      }, []),
    };

    res.json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get User Details
exports.getUserDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ id });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const totalCost = await Cost.aggregate([
      { $match: { userId: id } },
      { $group: { _id: null, total: { $sum: "$sum" } } },
    ]);

    res.json({
      first_name: user.first_name,
      last_name: user.last_name,
      id: user.id,
      total: totalCost.length > 0 ? totalCost[0].total : 0,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Developers Info
exports.getDevelopers = (req, res) => {
  res.json([
    { first_name: "Hen", last_name: "Hazum" },
    { first_name: "Yuval", last_name: "Betito" },
  ]);
};
