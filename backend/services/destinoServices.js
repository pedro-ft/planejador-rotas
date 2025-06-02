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

module.exports = {
    criarNovoDestino
}