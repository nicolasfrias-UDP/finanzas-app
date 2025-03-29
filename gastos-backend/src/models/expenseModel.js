const pool = require('../db');

const getLastDayOfMonth = (monthStr) => {
  const [year, month] = monthStr.split('-').map(Number);
  return new Date(year, month, 0).toISOString().split('T')[0]; // día 0 del mes siguiente = último del mes actual
};


const createExpense = async ({ userId, date, category, amount, description, isInstallment = false, installmentId = null }) => {
  const result = await pool.query(
    `INSERT INTO expenses (user_id, date, category, amount, description, is_installment, installment_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [userId, date, category, amount, description, isInstallment, installmentId]
  );
  return result.rows[0];
};

const getExpensesByUser = async (userId) => {
    const result = await pool.query(
      'SELECT * FROM expenses WHERE user_id = $1 ORDER BY date DESC',
      [userId]
    );
    return result.rows;
};

const updateExpense = async ({ id, userId, date, category, amount, description, isInstallment }) => {
    const result = await pool.query(
      `UPDATE expenses
       SET date = $1,
           category = $2,
           amount = $3,
           description = $4,
           is_installment = $5
       WHERE id = $6 AND user_id = $7
       RETURNING *`,
      [date, category, amount, description, isInstallment, id, userId]
    );
    return result.rows[0];
};

const deleteExpense = async ({ id, userId }) => {
    const result = await pool.query(
      'DELETE FROM expenses WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, userId]
    );
    return result.rows[0]; // Si no hay resultado, el gasto no existía o no era del usuario
};
const getExpensesByMonth = async (userId, month) => {
  const start = `${month}-01`;
  const end = getLastDayOfMonth(month);

  const result = await pool.query(
    `SELECT * FROM expenses 
     WHERE user_id = $1 
       AND date >= $2 
       AND date <= $3
     ORDER BY date DESC`,
    [userId, start, end]
  );

  return result.rows;
}; 
  
const getMonthlySummary = async (userId, month) => {
  const startDate = `${month}-01`;
  const endDate = getLastDayOfMonth(month);

  const result = await pool.query(
    `SELECT category, SUM(amount::numeric) as total
     FROM expenses
     WHERE user_id = $1
       AND date >= $2
       AND date <= $3
     GROUP BY category
     ORDER BY total DESC`,
    [userId, startDate, endDate]
  );

  return result.rows;
};


module.exports = { createExpense, getExpensesByUser, updateExpense, deleteExpense, getExpensesByMonth, getMonthlySummary };

  

