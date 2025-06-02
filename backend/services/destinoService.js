const db = require('../database/destinos.tabela');

const criarNovoDestino = (dadosDestino) => {
    return new Promise((resolve ,reject) => {
        if (!dadosDestino.cidade || !dadosDestino.pais){
            const error = new Error("Cidade e País são obrigatórios.")
            error.statusCode = 400
            return reject(error)
        }
        const destinoParaSalvar = {
            ...dadosDestino,
            lat: dadosDestino.lat || 0,
            lon: dadosDestino.lon || 0  
        }

        db.insert(destinoParaSalvar, (err, novoDoc) => {
            if (err) {
                const error = new Error("Erro ao inserir destino no banco de dados.");
                error.statusCode = 500;
                return reject(error);
            }
            resolve(novoDoc);
        });
    })
}

const buscarTodos = () => {
    return new Promise((resolve, reject) => {
        db.find({}).sort({ createdAt: -1}).exec((err, destinos) => {
            if(err){
                const error = new Error("Erro ao buscar destinos no banco de dados.")
                error.statusCode = 500
                return reject(error)
            }
            resolve(destinos)
        })
    })
}

const atualizarDestinoPorId = (id, dadosAtualizados) => {
    return new Promise((resolve, reject) => {
        if(!dadosAtualizados || Object.keys(dadosAtualizados).length === 0) {
            const error = new Error("Nenhum dado foi fornecido")
            error.statusCode = 400
            return reject(error);
        }
        db.update({ _id: id }, { $set: dadosAtualizados }, { returnUpdatedDocs: true }, (err, numAffected, affectedDocuments, upsert) => {
            if (err) {
                const error = new Error("Erro ao atualizar destino no banco de dados.");
                error.statusCode = 500; 
                return reject(error);
            }
            if (numAffected === 0) {
                return resolve(null);
            }
            resolve(affectedDocuments);
        })
    })
}

const deletarDestinoPorId = (id) => {
    return new Promise((resolve, reject) => {
        db.remove({_id: id}, {}, (err, numRemoved) => {
            if (err) {
                const error = new Error ("Erro ao excluir destino no banco de dados")
                error.statusCode = 500
                return reject(error)
            }
            resolve({numRemoved: numRemoved})
        })
    })
}

module.exports = {
    criarNovoDestino,
    buscarTodos,
    atualizarDestinoPorId,
    deletarDestinoPorId
}