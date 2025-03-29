const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const { addFixedExpense, listFixedExpenses, applyFixedExpensesForCurrentMonth } = require('../controllers/fixedExpenseController');


router.post('/', verifyToken, addFixedExpense);
router.get('/', verifyToken, listFixedExpenses);
router.post('/apply-month', verifyToken, applyFixedExpensesForCurrentMonth);
module.exports = router;
