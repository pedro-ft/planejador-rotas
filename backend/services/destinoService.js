const dbDestinos = require('../database/destinos.tabela');
const ORS_API_KEY = process.env.ORS_API_KEY;

const criarNovoDestino = (dadosDestino) => {
    return new Promise(async (resolve ,reject) => {
        if (!dadosDestino.cidade || !dadosDestino.cidade.trim()) {
            return reject({ message: "A cidade do destino é obrigatória.", statusCode: 400 });
        }
        if (!dadosDestino.pais || !dadosDestino.pais.trim()) {
            return reject({ message: "O país do destino é obrigatório.", statusCode: 400 });
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
                    const orsErrorMessage = geocodeData.error?.message || geocodeData.error || `Falha na comunicação com o serviço de geocodificação (status: ${geocodeResponse.status})`;
                    return reject({ statusCode: 502, message: `Serviço de geocodificação indisponível ou retornou um erro: ${orsErrorMessage}` });
                }
                if (!geocodeData.features || geocodeData.features.length === 0) {
                    return reject({ statusCode: 400, message: `Endereço não localizável: "${enderecoTextual}". Verifique os dados fornecidos.` });
                }
                
                const coordinates = geocodeData.features[0].geometry.coordinates;
                lon = coordinates[0];
                lat = coordinates[1];

            } catch (geocodeError) {
                return reject({ statusCode: 503, message: `Falha ao conectar com o serviço de geocodificação: ${geocodeError.message}` });
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
                return reject({ message: "Erro ao inserir destino no banco de dados.", statusCode: 500 });
            }
            resolve(novoDestinoSalvo);
        });
    })
}

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
    return new Promise((resolve, reject) => {
        if(!dadosAtualizados || Object.keys(dadosAtualizados).length === 0) {
            return reject({ message: "Nenhum dado foi fornecido para atualização.", statusCode: 400 });
        }
        dbDestinos.update({ _id: id }, { $set: dadosAtualizados }, { returnUpdatedDocs: true }, (err, numAffected, affectedDocuments) => {
            if (err) {
                return reject({ message: "Erro ao atualizar destino no banco de dados.", statusCode: 500 });
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