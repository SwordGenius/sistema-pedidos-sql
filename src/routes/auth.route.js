const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

router.post('/loginCliente', authController.loginAuthCliente);

module.exports = router;