const BASE_URL = 'http://localhost:4000/api';

/**
 * @param {string} endpoint 
 * @param {object} options 
 * @returns {Promise<any>} 
 * @throws {Error}
 */
async function request(endpoint, options = {}) {
    const url = `${BASE_URL}${endpoint}`;
    const token = localStorage.getItem('authToken'); 

    const defaultHeaders = {
        'Content-Type': 'application/json',
    }
    if (token) {
        defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

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
export const obterCalculoDetalhesRota = (coordenadasArray) => request('/rotas/calcular-detalhes', { method: 'POST', body: JSON.stringify({ coordenadas: coordenadasArray }) });
export const obterEnderecoPorCoordenadas = ({ lat, lon }) => request('/destinos/geocodificacao-reversa', { method: 'POST', body: JSON.stringify({ lat, lon })})

export const criarDestino = (dadosDestino) => request('/destinos', { method: 'POST', body: JSON.stringify(dadosDestino) });
export const deletarDestino = (idDestino) => request(`/destinos/${idDestino}`, { method: 'DELETE' });
export const atualizarDestino = (idDestino, dadosAtualizados) => request(`/destinos/${idDestino}`, { method: 'PUT',  body: JSON.stringify(dadosAtualizados)});

export const login = (username, password) => request('/auth/login', { method: 'POST', body: JSON.stringify({ username, password })});
export const registrar = (username, password) => request('/auth/registrar', { method: 'POST',body: JSON.stringify({ username, password })});
