const pool = require('../db');

const getBudgetForMonth = async (userId, month) => {
  const result = await pool.query(
    `SELECT * FROM budget WHERE user_id = $1 AND month = $2`,
    [userId, month]
  );
  return result.rows[0] || null;
};

const setOrUpdateBudget = async (userId, month, amount) => {
  const existing = await getBudgetForMonth(userId, month);

  if (existing) {
    const update = await pool.query(
      `UPDATE budget SET amount = $1 WHERE user_id = $2 AND month = $3 RETURNING *`,
      [amount, userId, month]
    );
    return update.rows[0];
  } else {
    const insert = await pool.query(
      `INSERT INTO budget (user_id, month, amount) VALUES ($1, $2, $3) RETURNING *`,
      [userId, month, amount]
    );
    return insert.rows[0];
  }
};

module.exports = {
  getBudgetForMonth,
  setOrUpdateBudget,
};
