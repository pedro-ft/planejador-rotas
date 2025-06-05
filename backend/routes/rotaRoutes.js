const express = require('express')
const router = express.Router()
const rotaController = require('../controllers/rotaController')
const protegerRota = require('../middleware/authMiddleware')

router.use(protegerRota)

router.post('/', rotaController.criarRota)
router.get('/', rotaController.listarRotas)
router.get('/:id', rotaController.buscarRotaPorId)
router.put('/:id', rotaController.atualizarRota)
router.delete('/:id', rotaController.deletarRota)
router.post('/calcular-detalhes', rotaController.obterDetalhesRota)

module.exports = router;