const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const { getUserBudget, saveUserBudget } = require('../controllers/budgetController');

router.get('/', verifyToken, getUserBudget);
router.post('/', verifyToken, saveUserBudget);

module.exports = router;
