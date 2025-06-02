const destinoService = require('../services/destinoService');

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

const listarDestinos = async (req, res) => {
    try{
        const todosOsDestinos = await destinoService.buscarTodos();
        res.status(200).json({
            message: "Destinos listados com sucesso!",
            data: todosOsDestinos
        })
    }catch (error){
        res.status(error.statusCode || 500).json({
            message: error.message || "Ocorreu um erro ao criar ao listar os destinos."
        })
    }
}

module.exports = {
    criarDestino,
    listarDestinos
}