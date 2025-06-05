const destinoService = require('../services/destinoService');

const criarDestino = async (req, res) => {
    try{
        const novoDestino = await destinoService.criarNovoDestino(req.body)
         res.status(201).json({
            message: "Destino criado com sucesso.",
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
            message: "Destinos listados com sucesso.",
            data: todosOsDestinos
        })
    }catch (error){
        res.status(error.statusCode || 500).json({
            message: error.message || "Ocorreu um erro ao listar os destinos."
        })
    }
}

const atualizarDestino = async (req, res) => {
    try {
        const idDoDestino = req.params.id
        const dadosAtualizados = req.body

        const destinoAtualizado = await destinoService.atualizarDestinoPorId(idDoDestino, dadosAtualizados)

        if (!destinoAtualizado) {
            return res.status(404).json({ message: "Destino não encontrado para atualização." });
        }

        res.status(200).json({
            message: "Destino atualizado com sucesso",
            data: destinoAtualizado
        })
    } catch (error){
        res.status(error.statusCode || 500).json({
            message: error.message || "Ocorreu um erro no servidor ao atualizar o destino."
        })
    }
}

const deletarDestino = async (req, res) => {
    try{
        const idDoDestino = req.params.id;

        const resultadoExclusao = await destinoService.deletarDestinoPorId(idDoDestino)

        if(resultadoExclusao.numRemoved === 0) {
            return res.status(404).json({ message: "Destino não encontrado para exclusão." })
        }
        
        res.status(200).json({
            message: "Destino excluido com sucesso",
            data: {id: idDoDestino, numRemoved: resultadoExclusao.numRemoved}
        })
    } catch (error) {
        res.status(error.statusCode || 500).json({
            message: error.message || "Ocorreu um erro no servidor ao excluir o destino"
        })
    }
}

module.exports = {
    criarDestino,
    listarDestinos,
    atualizarDestino,
    deletarDestino
}