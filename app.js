require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dbConnect = require('./utils/db');
const apiRoutes = require('./routes/api');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// ✅ Ensure API routes are mounted correctly
app.use('/api', apiRoutes);

// Connect to DB
dbConnect();

// Start the server ONLY if not in test mode
if (process.env.NODE_ENV !== 'test') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
