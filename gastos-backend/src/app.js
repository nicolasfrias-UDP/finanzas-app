const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const installmentRoutes = require('./routes/installmentRoutes');
const fixedExpenseRoutes = require('./routes/fixedExpenseRoutes');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/installments', installmentRoutes);
app.use('/api/fixed-expenses', fixedExpenseRoutes);

module.exports = app;
