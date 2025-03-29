const pool = require('../db');

const createFixedExpense = async ({ userId, description, amount, category, startDate, endDate }) => {
  const result = await pool.query(
    `INSERT INTO fixed_expenses (user_id, description, amount, category, start_date, end_date)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [userId, description, amount, category, startDate, endDate]
  );
  return result.rows[0];
};

const getActiveFixedExpenses = async (userId, dateRef = new Date()) => {
  const result = await pool.query(
    `SELECT * FROM fixed_expenses 
     WHERE user_id = $1
       AND is_active = TRUE
       AND start_date <= $2
       AND (end_date IS NULL OR end_date >= $2)`,
    [userId, dateRef]
  );
  return result.rows;
};

const expenseExistsForThisMonth = async ({ userId, category, amount, description, date }) => {
  const yearMonth = date.slice(0, 7);
  const startDate = `${yearMonth}-01`;
  const endDate = new Date(Number(yearMonth.slice(0, 4)), Number(yearMonth.slice(5)), 0)
    .toISOString()
    .split('T')[0];

  const result = await pool.query(
    `SELECT 1 FROM expenses
     WHERE user_id = $1
       AND category = $2
       AND amount = $3
       AND description = $4
       AND date BETWEEN $5 AND $6
     LIMIT 1`,
    [userId, category, amount, description, startDate, endDate]
  );

  return result.rowCount > 0;
};

const insertExpenseFromFixed = async ({ userId, date, category, amount, description }) => {
  const result = await pool.query(
    `INSERT INTO expenses 
     (user_id, date, category, amount, description, is_installment, installment_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [userId, date, category, amount, description, false, null]
  );
  return result.rows[0];
};

module.exports = {
  createFixedExpense,
  getActiveFixedExpenses,
  expenseExistsForThisMonth,
  insertExpenseFromFixed
};