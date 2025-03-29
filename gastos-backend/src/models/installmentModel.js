const pool = require('../db');

const createInstallment = async ({ userId, description, totalAmount, numInstallments, startDate }) => {
  const result = await pool.query(
    `INSERT INTO installments (user_id, description, total_amount, num_installments, start_date)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [userId, description, totalAmount, numInstallments, startDate]
  );
  return result.rows[0];
};

module.exports = { createInstallment };
