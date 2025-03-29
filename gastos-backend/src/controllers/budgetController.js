const { getBudgetForMonth, setOrUpdateBudget } = require('../models/budgetModel');

const getUserBudget = async (req, res) => {
  const userId = req.user.id;
  const { month } = req.query;

  if (!month) {
    return res.status(400).json({ error: 'Mes no especificado (formato: YYYY-MM)' });
  }

  try {
    const budget = await getBudgetForMonth(userId, month);
    res.json({ budget });
  } catch (err) {
    console.error('Error al obtener presupuesto:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const saveUserBudget = async (req, res) => {
  const userId = req.user.id;
  const { month, amount } = req.body;

  if (!month || !amount) {
    return res.status(400).json({ error: 'Mes y monto son obligatorios' });
  }

  try {
    const budget = await setOrUpdateBudget(userId, month, amount);
    res.status(201).json({ message: 'Presupuesto guardado ✅', budget });
  } catch (err) {
    console.error('Error al guardar presupuesto:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = {
  getUserBudget,
  saveUserBudget
};
