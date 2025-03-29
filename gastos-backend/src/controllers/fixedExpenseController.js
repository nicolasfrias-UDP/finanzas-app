const {
  createFixedExpense,
  getActiveFixedExpenses,
  expenseExistsForThisMonth,
  insertExpenseFromFixed
} = require('../models/fixedExpenseModel');

const addFixedExpense = async (req, res) => {
  const userId = req.user.id;
  const { description, amount, category, start_date } = req.body;

  try {
    const fixedExpense = await createFixedExpense({
      userId,
      description,
      amount,
      category,
      startDate: start_date,
    });

    res.status(201).json({ message: 'Gasto fijo creado ✅', fixedExpense });
  } catch (error) {
    console.error('Error al crear gasto fijo:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const listFixedExpenses = async (req, res) => {
  const userId = req.user.id;

  try {
    const fixedExpenses = await getActiveFixedExpenses(userId);
    res.json({ fixedExpenses });
  } catch (error) {
    console.error('Error al listar gastos fijos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const applyFixedExpensesForCurrentMonth = async (req, res) => {
  const userId = req.user.id;
  const todayStr = new Date().toISOString().split('T')[0];

  try {
    const fixedExpenses = await getActiveFixedExpenses(userId, todayStr);
    const inserted = [];

    for (const fx of fixedExpenses) {
      const exists = await expenseExistsForThisMonth({
        userId,
        category: fx.category,
        amount: fx.amount,
        description: fx.description,
        date: todayStr,
      });

      if (exists) continue;

      const expense = await insertExpenseFromFixed({
        userId,
        date: todayStr,
        category: fx.category,
        amount: fx.amount,
        description: fx.description,
      });

      inserted.push(expense);
    }

    res.json({ message: 'Gastos fijos aplicados ✅', gastosAgregados: inserted });
  } catch (err) {
    console.error('Error aplicando gastos fijos:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = {
  addFixedExpense,
  listFixedExpenses,
  applyFixedExpensesForCurrentMonth
};
