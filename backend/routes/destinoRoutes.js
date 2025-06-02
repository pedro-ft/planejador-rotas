const express = require('express');
const router = express.Router();
const destinosController = require('../controllers/destinoController');

router.post('/', destinosController.criarDestino);
router.get('/', destinosController.listarDestinos)

module.exports = router