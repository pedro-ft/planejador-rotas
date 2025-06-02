const destinoService = require('../services/destinoServices');

const criarDestino = async (req, res) => {
    try{
        const novoDestino = await destinoService.criarNovoDestino(req.body)
         res.status(201).json({
            message: "Destino criado com sucesso!",
            data: novoDestino
    })
    }catch(error){
        res.status(error.statusCode || 500).json({
            message: error.message || "Ocorreu um erro ao criar o destino."
        })
    }
}

module.exports = {
    criarDestino
}