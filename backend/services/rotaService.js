const dbRotas = require('../database/rotas.tabela.js');

const criarNova = (dadosRota) => {
    return new Promise((resolve, reject) => {
        if (!dadosRota.nome || !dadosRota.nome.trim()) {
            const error = new Error("O nome da rota é obrigatório.");
            error.statusCode = 400;
            return reject(error);
        }
        if (!dadosRota.destinos || !Array.isArray(dadosRota.destinos)) {
            const error = new Error("A lista de destinos é inválida.");
            error.statusCode = 400;
            return reject(error);
        }

        const rotaParaSalvar = {
            nome: dadosRota.nome.trim(),
            destinos: dadosRota.destinos, 
        };

        dbRotas.insert(rotaParaSalvar, (err, novaRotaSalva) => {
            if (err) {
                console.error("Erro ao inserir rota no NeDB:", err);
                const error = new Error("Erro interno ao salvar a rota no banco de dados.");
                error.statusCode = 500; 
                return reject(error);
            }
            resolve(novaRotaSalva); 
        });
    });
};

const buscarTodas = () => {
    return new Promise((resolve, reject) => {
        dbRotas.find({}).sort({ createdAt: -1 }).exec((err, rotas) => {
            if (err) {
                console.error("Erro ao buscar rotas no NeDB:", err);
                const error = new Error("Erro interno ao buscar as rotas no banco de dados.");
                error.statusCode = 500;
                return reject(error);
            }
            resolve(rotas);
        });
    });
};

const buscarPorIdUnica = (id) => {
    return new Promise((resolve, reject) => {
        dbRotas.findOne({ _id: id }, (err, rota) => {
            if (err) {
                console.error("Erro ao buscar rota por ID no NeDB:", err);
                const error = new Error("Erro interno ao buscar a rota por ID.");
                error.statusCode = 500;
                return reject(error);
            }
            resolve(rota); 
        });
    });
};

const atualizarPorId = (id, dadosParaAtualizar) => {
    return new Promise((resolve, reject) => {
        if (!dadosParaAtualizar || Object.keys(dadosParaAtualizar).length === 0) {
            const error = new Error("Nenhum dado fornecido para atualização da rota.");
            error.statusCode = 400;
            return reject(error);
        }

        if (dadosParaAtualizar.hasOwnProperty('nome') && (!dadosParaAtualizar.nome || !dadosParaAtualizar.nome.trim())) {
            const error = new Error("O nome da rota não pode ser vazio.");
            error.statusCode = 400;
            return reject(error);
        }
        if (dadosParaAtualizar.hasOwnProperty('destinos') && !Array.isArray(dadosParaAtualizar.destinos)) {
            const error = new Error("A lista de destinos para atualização é inválida.");
            error.statusCode = 400;
            return reject(error);
        }

        dbRotas.update({ _id: id }, { $set: dadosParaAtualizar }, { returnUpdatedDocs: true }, (err, numAffected, affectedDoc) => {
            if (err) {
                console.error("Erro ao atualizar rota no NeDB:", err);
                const error = new Error("Erro interno ao atualizar a rota.");
                error.statusCode = 500;
                return reject(error);
            }
            if (numAffected === 0 || !affectedDoc) {
                return resolve(null);
            }
            resolve(affectedDoc); 
        });
    });
};

const removerPorId = (id) => {
    return new Promise((resolve, reject) => {
        dbRotas.remove({ _id: id }, {}, (err, numRemoved) => {
            if (err) {
                console.error("Erro ao deletar rota no NeDB:", err);
                const error = new Error("Erro interno ao deletar a rota.");
                error.statusCode = 500;
                return reject(error);
            }
            resolve({ numRemoved: numRemoved });
        });
    });
};

module.exports = {
    criarNova,
    buscarTodas,
    buscarPorIdUnica,
    atualizarPorId,
    removerPorId
};