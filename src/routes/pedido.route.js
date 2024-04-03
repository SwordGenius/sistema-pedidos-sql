const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedido.controller');
const {verifyAuth} = require('../middlewares/auth.middleware');

router.get('/', pedidoController.index);
router.get('/:id', pedidoController.getById);
router.post('/', pedidoController.create);
router.patch('/:id', verifyAuth, pedidoController.updateById);
router.delete('/:id', verifyAuth, pedidoController.deleteById);
router.put('/:id', verifyAuth, pedidoController.putById);
router.get('/cliente/:id', verifyAuth, pedidoController.getAllByCliente);

module.exports = router;