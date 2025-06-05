const dbRotas = require('../database/rotas.tabela.js');

const ORS_API_KEY = process.env.ORS_API_KEY;

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

const calcularDetalhesRota = async (coordenadas) => {
    if (!coordenadas || coordenadas.length < 2) {
        throw new Error("Pelo menos duas coordenadas são necessárias para calcular uma rota.");
    }

    const orsApiUrl = 'https://api.openrouteservice.org/v2/directions/driving-car/json';

    const requestBody = {
        coordinates: coordenadas,
        instructions: true,   
        units: "m",
        preference: "fastest",
        geometry: false
    };

    try {
        console.log("Enviando para ORS com novo requestBody:", JSON.stringify(requestBody));
        const response = await fetch(orsApiUrl, {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Authorization': ORS_API_KEY,
                'Content-Type': 'application/json',
                'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8'
            }
        });

        if (!response.ok) {
            // Se a resposta não for OK, o corpo pode ser texto, HTML ou até JSON com erro.
            // Leia como texto para garantir que pegamos qualquer mensagem.
            const errorBodyText = await response.text(); // Lê o corpo da resposta de erro UMA VEZ.
            console.error("Erro da API ORS:", response.status, errorBodyText);

            let orsErrorMessage = errorBodyText;
            try {
                // Tenta parsear como JSON, pois o ORS PODE enviar erros estruturados em JSON.
                const errorJson = JSON.parse(errorBodyText);
                if (errorJson.error) {
                    // Formato comum de erro do ORS: { error: { message: "..." } } ou { error: "..." }
                    orsErrorMessage = typeof errorJson.error === 'string' ? errorJson.error : (errorJson.error.message || JSON.stringify(errorJson.error));
                } else if (errorJson.message) { // Outro formato possível
                    orsErrorMessage = errorJson.message;
                }
            } catch (e) {
                // Não era JSON, então errorBodyText já é a melhor mensagem de erro que temos.
            }
            // Usamos statusCode 502 (Bad Gateway) para indicar que o problema foi com o serviço externo.
            throw { statusCode: 502, message: `Serviço de roteirização retornou erro: ${orsErrorMessage}` };
        }

        // Se chegamos aqui, response.ok é true, então esperamos um JSON válido.
        const data = await response.json(); // Lê o corpo da resposta bem-sucedida UMA VEZ.

        // Agora processa 'data' como antes...
        if (data.routes && data.routes.length > 0) {
            const rotaPrincipal = data.routes[0];
            console.log("Resposta Detalhada da Rota Principal do ORS:", JSON.stringify(rotaPrincipal, null, 2));
            
            let sumarioTotalCalculado = null;
            let segmentosCalculados = [];

            if (rotaPrincipal.summary && typeof rotaPrincipal.summary.distance !== 'undefined' && typeof rotaPrincipal.summary.duration !== 'undefined') {
                sumarioTotalCalculado = {
                    distanciaMetros: rotaPrincipal.summary.distance,
                    duracaoSegundos: rotaPrincipal.summary.duration
                };
            } else {
                console.warn("ORS: rotaPrincipal.summary não encontrado ou incompleto na resposta.");
            }

            if (rotaPrincipal.segments && Array.isArray(rotaPrincipal.segments) && rotaPrincipal.segments.length > 0) {
                console.log("ORS: Encontrados", rotaPrincipal.segments.length, "segmentos.");
                segmentosCalculados = rotaPrincipal.segments.map(segmento => ({
                    distanciaMetros: segmento.distance,
                    duracaoSegundos: segmento.duration
                })).filter(s => typeof s.distanciaMetros !== 'undefined' && typeof s.duracaoSegundos !== 'undefined');
            } else {
                console.warn("ORS: rotaPrincipal.segments não encontrado, não é um array ou está vazio.");
                if (coordenadas.length === 2 && sumarioTotalCalculado) {
                    console.log("Rota de 2 pontos, usando sumário como único segmento.");
                    segmentosCalculados = [sumarioTotalCalculado];
                }
            }
            
            if (!sumarioTotalCalculado && segmentosCalculados.length > 0) {
                console.log("Sumário não encontrado, calculando total a partir dos segmentos.");
                sumarioTotalCalculado = segmentosCalculados.reduce((acc, seg) => {
                    acc.distanciaMetros += seg.distanciaMetros;
                    acc.duracaoSegundos += seg.duracaoSegundos;
                    return acc;
                }, { distanciaMetros: 0, duracaoSegundos: 0 });
            }
            
            if (!sumarioTotalCalculado) {
                 console.error("Não foi possível determinar o sumário total da rota a partir da resposta ORS.");
                 throw { statusCode: 500, message: "Não foi possível extrair o sumário da rota da API OpenRouteService." };
            }

            return {
                total: sumarioTotalCalculado,
                segmentos: segmentosCalculados
            };

        } else {
            console.warn("Resposta da API ORS (status OK) não continha rotas válidas:", data);
            throw { statusCode: 500, message: "Resposta da API OpenRouteService em formato inesperado ou rota não pôde ser calculada (apesar do status OK)." };
        }

    } catch (error) {
        // Este catch agora pega:
        // 1. Erros que nós lançamos (com error.statusCode).
        // 2. Erros de rede do fetch (ex: se o servidor ORS estiver totalmente offline).
        // 3. Erros se response.json() falhar (ex: ORS retorna status 200 mas com corpo inválido).
        if (error.statusCode) { // Se já é um erro que nós formatamos
            throw error;
        }
        
        // Para outros erros inesperados (ex: falha de rede, response.json() em resposta OK mas malformada)
        console.error("Erro inesperado ao processar rota externa:", error.name, error.message);
        throw { statusCode: 500, message: `Erro ao comunicar ou processar resposta do serviço de roteirização: ${error.message}` };
    }
};

module.exports = {
    criarNova,
    buscarTodas,
    buscarPorIdUnica,
    atualizarPorId,
    removerPorId,
    calcularDetalhesRota
};