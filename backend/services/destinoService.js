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

module.exports = {
    criarNovoDestino,
    buscarTodos
}