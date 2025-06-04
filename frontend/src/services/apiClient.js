const BASE_URL = 'http://localhost:4000/api';

/**
 * @param {string} endpoint 
 * @param {object} options 
 * @returns {Promise<any>} 
 * @throws {Error}
 */
async function request(endpoint, options = {}) {
    const url = `${BASE_URL}${endpoint}`;

    const defaultHeaders = {
        'Content-Type': 'application/json',
        // No futuro, se tiver autenticação, o token iria aqui:
        // 'Authorization': `Bearer ${seuTokenDeAutenticacao}`,
    };

    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    };

    try {
        const response = await fetch(url, config);

        if (response.status === 204) {
            return null;
        }

        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.message || `Erro HTTP: ${response.status} em ${url}`);
        }

        return responseData;
                             
    } catch (error) {
        console.error(`Erro na chamada API para ${endpoint}:`, error.message);
        throw error;
    }
}

export const getRotas = () => request('/rotas');
export const getRotaPorId = (idRota) => request(`/rotas/${idRota}`); 
export const criarRota = (dadosRota) => request('/rotas', { method: 'POST', body: JSON.stringify(dadosRota) });
export const deletarRota = (idRota) => request(`/rotas/${idRota}`, { method: 'DELETE' });
export const atualizarRota = (idRota, dadosAtualizados) => request(`/rotas/${idRota}`, { method: 'PUT', body: JSON.stringify(dadosAtualizados) });

// export const getDestinos = () => request('/destinos'); // Se precisarmos listar todos os destinos independentemente
export const criarDestino = (dadosDestino) => request('/destinos', { method: 'POST', body: JSON.stringify(dadosDestino) });
export const deletarDestino = (idDestino) => request(`/destinos/${idDestino}`, { method: 'DELETE' });
// Adicionar getDestinoPorId(id), atualizarDestino(id, dados) quando necessário

