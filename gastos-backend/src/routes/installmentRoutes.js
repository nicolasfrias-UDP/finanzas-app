const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const { addInstallment } = require('../controllers/installmentController');

router.post('/', verifyToken, addInstallment);

module.exports = router;
