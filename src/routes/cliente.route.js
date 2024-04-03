const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/cliente.controller');
const {verifyAuth} = require('../middlewares/auth.middleware');

router.get('/', clienteController.index);
router.get('/:id', clienteController.getById);
router.post('/', clienteController.create);
router.patch('/:id', verifyAuth, clienteController.updateById);
router.delete('/:id', verifyAuth, clienteController.deleteById);
router.put('/:id', verifyAuth, clienteController.putById);

module.exports = router;