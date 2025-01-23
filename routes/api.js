const express = require('express');
const {
    addCost,
    getMonthlyReport,
    getUserDetails,
    getDevelopers,
    addUser
} = require('../controllers/apiController');

const router = express.Router();

router.post('/add', addCost);
router.get('/report', getMonthlyReport);
router.get('/users/:id', getUserDetails);
router.get('/about', getDevelopers);
router.post('/addUser', addUser);

module.exports = router;
