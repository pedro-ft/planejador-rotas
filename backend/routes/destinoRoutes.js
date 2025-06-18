const express = require('express');
const router = express.Router();
const destinosController = require('../controllers/destinoController');

router.post('/', destinosController.criarDestino)
router.get('/', destinosController.listarDestinos)
router.put('/:id', destinosController.atualizarDestino)
router.delete('/:id', destinosController.deletarDestino)
router.post('/geocodificacao-reversa', destinosController.geocodificacaoReversa)

module.exports = router