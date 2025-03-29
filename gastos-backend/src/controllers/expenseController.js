const { createExpense } = require('../models/expenseModel');
const { getExpensesByUser } = require('../models/expenseModel');
const { updateExpense } = require('../models/expenseModel');
const { deleteExpense } = require('../models/expenseModel');
const { getExpensesByMonth } = require('../models/expenseModel');
const { getMonthlySummary } = require('../models/expenseModel');

const pool = require('../db');

const addExpense = async (req, res) => {
  const userId = req.user.id;
  const { date, category, amount, description, is_installment, installment_id } = req.body;

  try {
    const expense = await createExpense({
      userId,
      date,
      category,
      amount,
      description,
      isInstallment: is_installment,
      installmentId: installment_id || null
    });

    res.status(201).json({ message: 'Gasto creado con éxito ✅', expense });
  } catch (error) {
    console.error('Error al crear gasto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const getExpenses = async (req, res) => {
  const userId = req.user.id;
  const { month } = req.query;

  try {
    let expenses;

    if (month) {
      expenses = await getExpensesByMonth(userId, month);
    } else {
      expenses = await getExpensesByUser(userId);
    }

    res.json({ expenses });
  } catch (err) {
    console.error('Error al obtener gastos:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};


const editExpense = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const { date, category, amount, description, is_installment } = req.body;

  try {
    const updated = await updateExpense({
      id,
      userId,
      date,
      category,
      amount,
      description,
      isInstallment: is_installment
    });

    if (!updated) {
      return res.status(404).json({ error: 'Gasto no encontrado o no autorizado' });
    }

    res.json({ message: 'Gasto actualizado ✅', expense: updated });
  } catch (error) {
    console.error('Error al actualizar gasto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const removeExpense = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    const deleted = await deleteExpense({ id, userId });

    if (!deleted) {
      return res.status(404).json({ error: 'Gasto no encontrado o no autorizado' });
    }

    res.json({ message: 'Gasto eliminado ✅', expense: deleted });
  } catch (error) {
    console.error('Error al eliminar gasto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const getMonthlySummaryController = async (req, res) => {
  const userId = req.user.id;
  const { month } = req.query;

  if (!month) {
    return res.status(400).json({ error: 'Mes no especificado (formato: YYYY-MM)' });
  }

  try {
    const resumen = await getMonthlySummary(userId, month);
    const totalGasto = resumen.reduce((acc, row) => acc + parseFloat(row.total), 0);

    res.json({
      total: totalGasto,
      porCategoria: resumen,
    });
  } catch (err) {
    console.error('Error al obtener resumen mensual:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};




module.exports = { addExpense, getExpenses, editExpense, removeExpense, getMonthlySummaryController };

