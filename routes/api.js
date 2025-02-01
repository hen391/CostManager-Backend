const express = require('express');
const { addCost, getMonthlyReport, getUserDetails, getDevelopers,addUser } = require('../controllers/api_controller');

const router = express.Router();

router.post('/add', addCost); // ✅ Ensure this exists
router.get('/report', getMonthlyReport);
router.get('/users/:id', getUserDetails);
router.get('/about', getDevelopers);
router.post('/users', addUser);

module.exports = router;
