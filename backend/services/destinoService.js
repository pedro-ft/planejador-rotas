const dbDestinos = require('../database/destinos.tabela');
const ORS_API_KEY = process.env.ORS_API_KEY;

async function obterCoordenadas(enderecoTextual) {
    if (!ORS_API_KEY) {
        throw new Error("Chave API ORS ausente. Geocodificação pulada.")
    }
    if (!enderecoTextual || !enderecoTextual.trim()) {
        throw new Error("Endereço textual vazio. Geocodificação pulada.")
    }

    try {
        const encodedAddress = encodeURIComponent(enderecoTextual);
        const geocodeUrl = `https://api.openrouteservice.org/geocode/search?api_key=${ORS_API_KEY}&text=${encodedAddress}&size=1`;

        const geocodeResponse = await fetch(geocodeUrl);
        const geocodeData = await geocodeResponse.json();

        if (geocodeResponse.ok && geocodeData.features && geocodeData.features.length > 0) {
            const coordinates = geocodeData.features[0].geometry.coordinates;
            return { lon: coordinates[0], lat: coordinates[1] };
        } else {
            throw new Error(`Endereço não localizável: "${enderecoTextual}". Verifique os dados fornecidos.`);
        }
    } catch (error) {
        if (error.statusCode) throw error; 

        throw new Error("Falha na comunicação com o serviço de geocodificação.");
    }
}

const criarNovoDestino = (dadosDestino) => {
    return new Promise(async (resolve ,reject) => {
        try{
            if (!dadosDestino.cidade || !dadosDestino.cidade.trim()) {
                return reject({ message: "A cidade do destino é obrigatória.", statusCode: 400 });
            }
            if (!dadosDestino.pais || !dadosDestino.pais.trim()) {
                return reject({ message: "O país do destino é obrigatório.", statusCode: 400 });
            }

            const enderecoTextual = `${dadosDestino.observacoes || ''}, ${dadosDestino.cidade}, ${dadosDestino.pais}`.trim().replace(/^,|,$/g, '');
            const { lon, lat } = await obterCoordenadas(enderecoTextual);

            const destinoParaSalvar = {
                cidade: dadosDestino.cidade.trim(),
                pais: dadosDestino.pais.trim(),
                observacoes: dadosDestino.observacoes ? dadosDestino.observacoes.trim() : '',
                lat: lat, 
                lon: lon
            };

            dbDestinos.insert(destinoParaSalvar, (err, novoDestinoSalvo) => {
                if (err) {
                    return reject({ message: "Erro ao inserir destino no banco de dados.", statusCode: 500 });
                }
                resolve(novoDestinoSalvo);
            });

        }catch (error) {
            return reject(error);
        }
    });
};

const buscarTodos = () => {
    return new Promise((resolve, reject) => {
        dbDestinos.find({}).sort({ createdAt: -1}).exec((err, destinos) => {
            if(err){
                return reject({ message: "Erro ao buscar destinos no banco de dados.", statusCode: 500 });
            }
            resolve(destinos)
        })
    })
}

const atualizarDestinoPorId = (id, dadosAtualizados) => {
    return new Promise(async (resolve, reject) => {
        try{
            if(!dadosAtualizados || Object.keys(dadosAtualizados).length === 0) {
                return reject({ message: "Nenhum dado foi fornecido para atualização.", statusCode: 400 });
            }
            const precisaReGeocodificar = dadosAtualizados.cidade || dadosAtualizados.pais || dadosAtualizados.hasOwnProperty('observacoes');
            
            if (precisaReGeocodificar) {
                const destinoAtual = await new Promise((res, rej) => dbDestinos.findOne({ _id: id }, (err, doc) => err ? rej(err) : res(doc)));
                if (!destinoAtual) {
                    return resolve(null);
                }

                const cidade = dadosAtualizados.cidade || destinoAtual.cidade;
                const pais = dadosAtualizados.pais || destinoAtual.pais;
                const observacoes = dadosAtualizados.hasOwnProperty('observacoes') ? dadosAtualizados.observacoes : destinoAtual.observacoes;
                const enderecoTextual = `${observacoes || ''}, ${cidade}, ${pais}`.trim().replace(/^,|,$/g, '');
                
                const { lon, lat } = await obterCoordenadas(enderecoTextual);
                
                dadosAtualizados.lat = lat;
                dadosAtualizados.lon = lon;
            }

            dbDestinos.update({ _id: id }, { $set: dadosAtualizados }, { returnUpdatedDocs: true }, (err, numAffected, affectedDoc) => {
                if (err) {
                    return reject({ message: "Erro ao atualizar destino no banco de dados.", statusCode: 500 });
                }
                if (numAffected === 0) {
                    return resolve(null);
                }
                resolve(affectedDoc);
            });
        } catch (error) {
            return reject(error);
        }
    });
};

const deletarDestinoPorId = (id) => {
    return new Promise((resolve, reject) => {
        dbDestinos.remove({_id: id}, {}, (err, numRemoved) => {
            if (err) {
                return reject({ message: "Erro ao excluir destino no banco de dados.", statusCode: 500 });
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