import React from 'react';

function ResumoRota({ destinos }) {
    const numeroDeDestinos = destinos ? destinos.length : 0;
    const numeroDeTrechos = numeroDeDestinos > 1 ? numeroDeDestinos - 1 : 0;

    const tempoEstimadoTotalMinutos = numeroDeTrechos * 20;
    const distanciaEstimadaTotalKm = numeroDeTrechos * 15;

    return (
        <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h3>Resumo da Rota (Estimado)</h3>
            <p>Tempo Total Estimado: {tempoEstimadoTotalMinutos} min</p>
            <p>Distância Total Estimada: {distanciaEstimadaTotalKm} km</p>
        </div>
    );
}

export default ResumoRota;