require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const dbConnect = require('./utils/db');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to the database
dbConnect();

// Middleware
app.use(bodyParser.json());
app.use('/api', apiRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
