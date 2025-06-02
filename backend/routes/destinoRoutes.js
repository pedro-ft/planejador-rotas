const express = require('express');
const router = express.Router();
const destinosController = require('../controllers/destinoController');

router.post('/', destinosController.criarDestino);

module.exports = router