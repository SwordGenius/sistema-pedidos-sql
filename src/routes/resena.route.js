const express = require('express');
const router = express.Router();
const resenaController = require('../controllers/resena.controller');
const {verifyAuth} = require('../middlewares/auth.middleware');

router.get('/', resenaController.index);
router.get('/:id', resenaController.getById);
router.post('/', resenaController.create);
router.patch('/:id', verifyAuth, resenaController.updateById);
router.delete('/:id', verifyAuth, resenaController.deleteById);
router.put('/:id', verifyAuth, resenaController.putById);

module.exports = router;