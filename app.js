require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const dbConnect = require('./utils/db');
const apiRoutes = require('./routes/api');

const app = express();
app.use(express.json());

// Middleware
app.use(bodyParser.json());
app.use('/api', apiRoutes);

if (process.env.NODE_ENV !== 'test') {
    const PORT = process.env.PORT || 3000;
    dbConnect(); // Connect to the database only in non-test environments
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app; // Export the app for testing
