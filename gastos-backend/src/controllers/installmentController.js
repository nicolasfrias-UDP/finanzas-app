const { createInstallment } = require('../models/installmentModel');
const pool = require('../db');

const addInstallment = async (req, res) => {
  const userId = req.user.id;
  const { description, total_amount, num_installments, start_date } = req.body;

  try {
    const installment = await createInstallment({
      userId,
      description,
      totalAmount: total_amount,
      numInstallments: num_installments,
      startDate: start_date,
    });

    // Calcular cuotas
    const cuotaMonto = (parseFloat(total_amount) / num_installments).toFixed(2);

    const expenses = [];

    for (let i = 0; i < num_installments; i++) {
      const date = new Date(start_date);
      date.setMonth(date.getMonth() + i); // una cuota por mes

      expenses.push({
        user_id: userId,
        date: date.toISOString().split('T')[0],
        category: 'Compra en cuotas',
        amount: cuotaMonto,
        description: `${description} (cuota ${i + 1}/${num_installments})`,
        is_installment: true,
        installment_id: installment.id,
      });
    }

    // Insertar cuotas en tabla expenses
    const insertQuery = `
      INSERT INTO expenses (user_id, date, category, amount, description, is_installment, installment_id)
      VALUES ${expenses.map((_, i) => `($${i * 7 + 1}, $${i * 7 + 2}, $${i * 7 + 3}, $${i * 7 + 4}, $${i * 7 + 5}, $${i * 7 + 6}, $${i * 7 + 7})`).join(',')}
      RETURNING *;
    `;

    const insertValues = expenses.flatMap((e) => [
      e.user_id,
      e.date,
      e.category,
      e.amount,
      e.description,
      e.is_installment,
      e.installment_id,
    ]);

    const inserted = await pool.query(insertQuery, insertValues);

    res.status(201).json({
      message: 'Compra en cuotas registrada con éxito ✅',
      cuotas: inserted.rows,
    });
  } catch (error) {
    console.error('Error al registrar cuotas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = { addInstallment };
