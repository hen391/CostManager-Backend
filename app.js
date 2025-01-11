process.removeAllListeners('warning');
const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const apiRoutes = require('./routes/api');

const app = express();
connectDB()
    .then(() => console.log('MongoDB Connected'))
    .catch((error) => {
        console.error('Database connection failed:', error);
        process.exit(1);
    });
app.use(bodyParser.json());
app.use('/api', apiRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
