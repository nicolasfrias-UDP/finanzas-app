const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const { getExpenses, addExpense, editExpense, removeExpense, getMonthlySummaryController } = require('../controllers/expenseController');

router.get('/summary', verifyToken, getMonthlySummaryController); // Ruta para ver resumen mensual
router.post('/', verifyToken, addExpense); // Ruta para agregar gastos
router.get('/', verifyToken, getExpenses);
router.put('/:id', verifyToken, editExpense); // Ruta para editar gastos
router.delete('/:id', verifyToken, removeExpense); // Ruta para eliminar un gasto


module.exports = router;
