const rotaService = require('../services/rotaService'); 

const criarRota = async (req, res) => {
    try {
        const novaRota = await rotaService.criarNova(req.body);
        res.status(201).json({
            message: "Rota criada com sucesso.",
            data: novaRota
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({ 
            message: error.message || "Ocorreu um erro no servidor ao criar a rota."
        });
    }
};

const listarRotas = async (req, res) => {
    try {
        const todasAsRotas = await rotaService.buscarTodas();
        res.status(200).json({
            message: "Rotas listadas com sucesso!",
            data: todasAsRotas
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            message: error.message || "Ocorreu um erro no servidor ao listar as rotas."
        });
    }
};

const buscarRotaPorId = async (req, res) => {
    try {
        const idDaRota = req.params.id;
        const rota = await rotaService.buscarPorIdUnica(idDaRota);

        if (!rota) {
            return res.status(404).json({ message: "Rota não encontrada." });
        }

        res.status(200).json({
            message: "Rota encontrada com sucesso!",
            data: rota
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            message: error.message || "Ocorreu um erro no servidor ao buscar a rota."
        });
    }
};

const atualizarRota = async (req, res) => {
    try {
        const idDaRota = req.params.id;
        const dadosParaAtualizar = req.body;

        const rotaAtualizada = await rotaService.atualizarPorId(idDaRota, dadosParaAtualizar);

        if (!rotaAtualizada) {
            return res.status(404).json({ message: "Rota não encontrada para atualização." });
        }

        res.status(200).json({
            message: "Rota atualizada com sucesso.",
            data: rotaAtualizada
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            message: error.message || "Ocorreu um erro no servidor ao atualizar a rota."
        });
    }
};

const deletarRota = async (req, res) => {
    try {
        const idDaRota = req.params.id;
        const resultadoExclusao = await rotaService.removerPorId(idDaRota);

        if (resultadoExclusao.numRemoved === 0) {
            return res.status(404).json({ message: "Rota não encontrada para exclusão." });
        }

        res.status(200).json({
            message: "Rota deletada com sucesso!",
            data: { id: idDaRota, numRemoved: resultadoExclusao.numRemoved }
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            message: error.message || "Ocorreu um erro no servidor ao deletar a rota."
        });
    }
};

const obterDetalhesRota = async (req, res) => {
    try {
        const { coordenadas } = req.body; 

        if (!coordenadas || !Array.isArray(coordenadas) || coordenadas.length < 2) {
            return res.status(400).json({ message: "Formato de coordenadas inválido ou insuficiente." });
        }

        const detalhes = await rotaService.calcularDetalhesRota(coordenadas);

        res.status(200).json({
            message: "Detalhes da rota calculados com sucesso.",
            data: detalhes
        });

    } catch (error) {
        res.status(error.statusCode || 500).json({
            message: error.message || "Erro ao calcular detalhes da rota."
        });
    }
};



module.exports = {
    criarRota,
    listarRotas,
    buscarRotaPorId,
    atualizarRota,
    deletarRota,
    obterDetalhesRota
};