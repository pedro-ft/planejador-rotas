const dbRotas = require('../database/rotas.tabela.js');
const ORS_API_KEY = process.env.ORS_API_KEY;

const criarNova = (dadosRota, userId) => {
    return new Promise(async (resolve, reject) => {
        if (!dadosRota.nome || !dadosRota.nome.trim()) {
            return reject({ message: "O nome da rota é obrigatório.", statusCode: 400 });
        }
        if (!dadosRota.destinos || !Array.isArray(dadosRota.destinos)) {
            return reject({ message: "A lista de destinos é inválida.", statusCode: 400 });
        }

        const rotaParaSalvar = {
            userId: userId,
            nome: dadosRota.nome.trim(),
            destinos: dadosRota.destinos, 
            detalhesCalculados: null
        };

        if (dadosRota.destinos.length >= 2) {
            try {
                const coordenadas = dadosRota.destinos.map(d => {
                    if (typeof d.lon !== 'number' || typeof d.lat !== 'number') {
                        throw new Error(`Destino "${d.nome || d.cidade || 'Desconhecido'}" na rota não possui coordenadas válidas.`);
                    }
                    return [d.lon, d.lat];
                });
                
                const calculo = await calcularDetalhesRota(coordenadas);
                rotaParaSalvar.detalhesCalculados = calculo;
            } catch (errorCalculo) {
                console.error(`Falha ao calcular detalhes para a nova rota "${rotaParaSalvar.nome}": ${errorCalculo.message}`);
                rotaParaSalvar.detalhesCalculados = { error: `Falha no cálculo: ${errorCalculo.message}`, statusCode: errorCalculo.statusCode };
            }
        }

        dbRotas.insert(rotaParaSalvar, (err, novaRotaSalva) => {
            if (err) {
                return reject({ message: "Erro interno ao salvar a rota no banco de dados.", statusCode: 500 });
            }
            resolve(novaRotaSalva); 
        });
    });
};

const buscarTodas = (userId) => {
    return new Promise((resolve, reject) => {
        dbRotas.find({userId: userId}).sort({ createdAt: -1 }).exec((err, rotas) => {
            if (err) {
                console.error("Erro ao buscar rotas no NeDB:", err);
                return reject({ message: "Erro interno ao buscar as rotas no banco de dados.", statusCode: 500 });;
            }
            resolve(rotas);
        });
    });
};

const buscarPorIdUnica = (id, userId) => {
    return new Promise((resolve, reject) => {
        dbRotas.findOne({ _id: id, userId: userId }, (err, rota) => {
            if (err) {
                return reject({ message: "Erro interno ao buscar a rota por ID.", statusCode: 500 });
            }
            resolve(rota); 
        });
    });
};

const atualizarPorId = (id, dadosParaAtualizar, userId) => {
    return new Promise(async (resolve, reject) => {
        if (!dadosParaAtualizar || Object.keys(dadosParaAtualizar).length === 0) {
            return reject({ message: "Nenhum dado fornecido para atualização da rota.", statusCode: 400 });
        }
        if (dadosParaAtualizar.hasOwnProperty('nome') && (!dadosParaAtualizar.nome || !dadosParaAtualizar.nome.trim())) {
            return reject({ message: "O nome da rota não pode ser vazio.", statusCode: 400 });
        }
        if (dadosParaAtualizar.hasOwnProperty('destinos') && !Array.isArray(dadosParaAtualizar.destinos)) {
            return reject({ message: "A lista de destinos para atualização é inválida.", statusCode: 400 });
        }

        let dadosSet = { ...dadosParaAtualizar };

        if (dadosParaAtualizar.destinos && Array.isArray(dadosParaAtualizar.destinos) && dadosParaAtualizar.destinos.length >= 2) {
            try {
                const coordenadas = dadosParaAtualizar.destinos.map(d => {
                    if (typeof d.lon !== 'number' || typeof d.lat !== 'number') {
                        throw new Error(`Destino "${d.nome || d.cidade || 'Desconhecido'}" na rota atualizada não possui coordenadas válidas.`);
                    }
                    return [d.lon, d.lat];
                });
                const calculo = await calcularDetalhesRota(coordenadas);
                dadosSet.detalhesCalculados = calculo;
            } catch (errorCalculo) {
                console.error(`Falha ao recalcular detalhes para a rota ID "${id}": ${errorCalculo.message}`);
                dadosSet.detalhesCalculados = { error: `Falha no recálculo: ${errorCalculo.message}`, statusCode: errorCalculo.statusCode };
            }
        } else if (dadosParaAtualizar.destinos && dadosParaAtualizar.destinos.length < 2) {
            dadosSet.detalhesCalculados = null;
        }

        dbRotas.update({ _id: id, userId: userId }, { $set: dadosSet }, { returnUpdatedDocs: true }, (err, numAffected, affectedDoc) => {
            if (err) {
                console.error("Erro ao atualizar rota no NeDB:", err);
                return reject({ message: "Erro interno ao atualizar a rota.", statusCode: 500 });
            }
            if (numAffected === 0 || !affectedDoc) {
                return resolve(null);
            }
            resolve(affectedDoc); 
        });
    });
};

const removerPorId = (id, userId) => {
    return new Promise((resolve, reject) => {
        dbRotas.remove({ _id: id, userId: userId }, {}, (err, numRemoved) => {
            if (err) {
                console.error("Erro ao deletar rota no NeDB:", err);
                return reject({ message: "Erro interno ao deletar a rota.", statusCode: 500 });
            }
            resolve({ numRemoved: numRemoved });
        });
    });
};

const calcularDetalhesRota = async (coordenadas) => {
     if (!ORS_API_KEY) {
        throw new Error("Configuração do servidor incompleta: Chave API de roteirização ausente.");
    }
    if (!coordenadas || coordenadas.length < 2) {
        throw new Error("Pelo menos duas coordenadas são necessárias para calcular uma rota.");
    }

    const orsApiUrl = 'https://api.openrouteservice.org/v2/directions/driving-car/json';
    const requestBody = {
        coordinates: coordenadas,
        units: "m"
    };

    try {
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
            const errorBodyText = await response.text();
            console.error("Erro da API ORS:", response.status, errorBodyText);
            let orsErrorMessage = errorBodyText;
            try {
                const errorJson = JSON.parse(errorBodyText);
                if (errorJson.error) {
                    orsErrorMessage = typeof errorJson.error === 'string' ? errorJson.error : (errorJson.error.message || JSON.stringify(errorJson.error));
                } else if (errorJson.message) {
                    orsErrorMessage = errorJson.message;
                }
            } catch (e) {}
            throw { statusCode: 502, message: `Serviço de roteirização retornou erro: ${orsErrorMessage}` };
        }

        const data = await response.json();
        if (data.routes && data.routes.length > 0) {
            const rotaPrincipal = data.routes[0];
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
                segmentosCalculados = rotaPrincipal.segments.map(segmento => ({
                    distanciaMetros: segmento.distance,
                    duracaoSegundos: segmento.duration
                })).filter(s => typeof s.distanciaMetros !== 'undefined' && typeof s.duracaoSegundos !== 'undefined');
            } else {
                if (coordenadas.length === 2 && sumarioTotalCalculado) {
                    segmentosCalculados = [sumarioTotalCalculado];
                }
            }
            
            if (!sumarioTotalCalculado && segmentosCalculados.length > 0) {
                sumarioTotalCalculado = segmentosCalculados.reduce((acc, seg) => {
                    acc.distanciaMetros += seg.distanciaMetros;
                    acc.duracaoSegundos += seg.duracaoSegundos;
                    return acc;
                }, { distanciaMetros: 0, duracaoSegundos: 0 });
            }
            
            if (!sumarioTotalCalculado) {
                 throw { statusCode: 500, message: "Não foi possível extrair o sumário da rota da API OpenRouteService." };
            }
            return {
                total: sumarioTotalCalculado,
                segmentos: segmentosCalculados
            };
    } else {
            throw { statusCode: 500, message: "Resposta da API OpenRouteService em formato inesperado ou rota não pôde ser calculada (apesar do status OK)." };
        }
    } catch (error) {
        if (error.statusCode) { 
            throw error;
        }
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