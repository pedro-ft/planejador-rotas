export function formatarDistancia(metros) {
    if (typeof metros !== 'number') return 'N/A';
    if (metros < 1000) {
        return `${Math.round(metros)} m`;
    }
    return `${(metros / 1000).toFixed(1)} km`.replace('.', ',');
}

export function formatarDuracao(segundosTotais) {
    if (typeof segundosTotais !== 'number') return 'N/A';
    const horas = Math.floor(segundosTotais / 3600);
    const minutos = Math.floor((segundosTotais % 3600) / 60);

    let resultado = '';
    if (horas > 0) {
        resultado += `${horas}h `;
    }
    if (minutos > 0 || horas === 0) {
        resultado += `${minutos}min`;
    }
    if (resultado === '') return '0min';
    return resultado.trim();
}