const dbDestinos = require('../database/destinos.tabela');

const ORS_API_KEY = process.env.ORS_API_KEY;
if (!ORS_API_KEY) {
    console.error("Chave da API não foi encontrada");
}


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

        if (ORS_API_KEY) { 
            try {
                const enderecoTextual = `${dadosDestino.observacoes || ''}, ${dadosDestino.cidade}, ${dadosDestino.pais}`.trim().replace(/^,|,$/g, '');
                const encodedAddress = encodeURIComponent(enderecoTextual);
                const geocodeUrl = `https://api.openrouteservice.org/geocode/search?api_key=${ORS_API_KEY}&text=${encodedAddress}&size=1`
                console.log(`Buscando coordenadas para: ${enderecoTextual}`);
                console.log(`URL Geocodificação ORS: ${geocodeUrl}`);

                const geocodeResponse = await fetch(geocodeUrl);
                const geocodeData = await geocodeResponse.json();

                if (geocodeResponse.ok && geocodeData.features && geocodeData.features.length > 0) {
                    const coordinates = geocodeData.features[0].geometry.coordinates;
                    lon = coordinates[0]; 
                    lat = coordinates[1];
                    console.log(`Coordenadas encontradas: Lon=<span class="math-inline">\{lon\}, Lat\=</span>{lat}`);
                } else {
                    console.warn(`Geocodificação não encontrou coordenadas para "${enderecoTextual}". Resposta ORS:`, geocodeData);
                    // Decide se quer lançar um erro ou continuar com lat/lon = 0
                    // Por agora, vamos apenas logar e continuar com 0,0
                    // Poderia ser: reject(new Error(`Endereço não encontrado: ${enderecoTextual}`));
                }
            } catch (geocodeError) {
                console.error("Erro durante a chamada de geocodificação para ORS:", geocodeError);
                // Decide se quer lançar um erro ou continuar com lat/lon = 0
                // Por agora, vamos apenas logar e continuar com 0,0
                // reject(new Error("Falha ao buscar coordenadas do endereço.")); return;
            }
        } else {
            console.warn("Chave da API ORS não configurada. Lat/Lon serão definidos como 0.");
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