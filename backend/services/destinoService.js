const dbDestinos = require('../database/destinos.tabela');

const ORS_API_KEY = process.env.ORS_API_KEY;

const criarNovoDestino = (dadosDestino) => {
    return new Promise(async (resolve ,reject) => {
        if (!dadosDestino.cidade || !dadosDestino.cidade.trim()) {
            const error = new Error("A cidade do destino é obrigatória.");
            error.statusCode = 400;
            return reject(error);
        }
        if (!dadosDestino.pais || !dadosDestino.pais.trim()) {
            const error = new Error("O país do destino é obrigatório.");
            error.statusCode = 400;
            return reject(error);
        }

        let lat = 0;
        let lon = 0; 

        if (!ORS_API_KEY) { 
            return reject({ statusCode: 500, message: "Configuração interna do servidor: Chave da API de geocodificação ausente." });
        }else{
            try {
                const enderecoTextual = `${dadosDestino.observacoes || ''}, ${dadosDestino.cidade}, ${dadosDestino.pais}`.trim().replace(/^,|,$/g, '');
                const encodedAddress = encodeURIComponent(enderecoTextual);
                const geocodeUrl = `https://api.openrouteservice.org/geocode/search?api_key=${ORS_API_KEY}&text=${encodedAddress}&size=1`
                const geocodeResponse = await fetch(geocodeUrl);
                const geocodeData = await geocodeResponse.json();

                if (!geocodeResponse.ok) {
                    console.error("Erro da API ORS:", geocodeResponse.status, geocodeData);
                    const orsErrorMessage = geocodeData.error?.message || geocodeData.error || `Falha na comunicação com o serviço de geocodificação (status: ${geocodeResponse.status})`;
                    return reject({ statusCode: 502, message: `Serviço de geocodificação indisponível ou retornou um erro: ${orsErrorMessage}` });
                }
                if (!geocodeData.features || geocodeData.features.length === 0) {
                    console.warn(`Geocodificação não encontrou coordenadas para "${enderecoTextual}".`);
                    return reject({ statusCode: 400, message: `Endereço não localizável: "${enderecoTextual}". Verifique os dados fornecidos.` });
                }
                
                const coordinates = geocodeData.features[0].geometry.coordinates;
                lon = coordinates[0];
                lat = coordinates[1];

            } catch (geocodeError) {
                console.error("Exceção durante a chamada de geocodificação para ORS:", geocodeError);
                return reject({ statusCode: 503, message: `Falha ao conectar com o serviço de geocodificação: ${geocodeError.message}` }); // 503 Service Unavailable
            }
        }

        const destinoParaSalvar = {
            cidade: dadosDestino.cidade.trim(),
            pais: dadosDestino.pais.trim(),
            observacoes: dadosDestino.observacoes ? dadosDestino.observacoes.trim() : '',
            lat: lat, 
            lon: lon
        }

        dbDestinos.insert(destinoParaSalvar, (err, novoDestinoSalvo) => {
            if (err) {
                const error = new Error("Erro ao inserir destino no banco de dados.");
                error.statusCode = 500;
                return reject(error);
            }
            resolve(novoDestinoSalvo);
        });
    })
}

const buscarTodos = () => {
    return new Promise((resolve, reject) => {
        dbDestinos.find({}).sort({ createdAt: -1}).exec((err, destinos) => {
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
        dbDestinos.update({ _id: id }, { $set: dadosAtualizados }, { returnUpdatedDocs: true }, (err, numAffected, affectedDocuments, upsert) => {
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
        dbDestinos.remove({_id: id}, {}, (err, numRemoved) => {
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