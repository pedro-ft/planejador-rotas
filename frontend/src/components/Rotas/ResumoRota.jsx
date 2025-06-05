import React from 'react';
import { formatarDistancia, formatarDuracao } from '../../utils/formatacao.js'

function ResumoRota({ detalhesCalculados, isLoading, error, numDestinosNaRotaAtual }) {

    let tempoDisplay = "-- min";
    let distanciaDisplay = "-- km";
    let segmentosDisplay = null;
    let mensagemInformativa = null;

    if (isLoading) {
        tempoDisplay = "Calculando...";
        distanciaDisplay = "Calculando...";
    } else if (error) {
        tempoDisplay = "Erro";
        distanciaDisplay = "Erro";
    } else if (detalhesCalculados && detalhesCalculados.total) {
        tempoDisplay = formatarDuracao(detalhesCalculados.total.duracaoSegundos);
        distanciaDisplay = formatarDistancia(detalhesCalculados.total.distanciaMetros);
        
        if (detalhesCalculados.segmentos && detalhesCalculados.segmentos.length > 0) {
            segmentosDisplay = (
                <div style={{marginTop: '10px', fontSize: '0.9em'}}>
                    <strong>Trechos:</strong>
                    <ul style={{listStyle: 'none', paddingLeft: '10px', maxHeight: '100px', overflowY: 'auto'}}>
                        {detalhesCalculados.segmentos.map((seg, idx) => (
                            <li key={idx} style={{display: 'flex', alignItems: 'center', marginBottom: '4px'}}>
                                <span style={{minWidth: '70px'}}>Trecho {idx + 1}:</span>
                                {formatarDistancia(seg.distanciaMetros)}
                                <span style={{margin: "0 5px"}}>|</span>
                                {formatarDuracao(seg.duracaoSegundos)}
                            </li>
                        ))}
                    </ul>
                </div>
            );
        }
    } else if (numDestinosNaRotaAtual >= 2) {
        mensagemInformativa = <p style={{fontStyle: 'italic', fontSize: '0.9em'}}>Clique em "Calcular Prévia Detalhada" para ver os totais.</p>;
    } else {
        mensagemInformativa = <p style={{fontStyle: 'italic', fontSize: '0.9em'}}>Adicione pelo menos dois destinos para calcular a rota.</p>;
    }

    return (
        <div>
            <p>
                Tempo Total: {tempoDisplay}
            </p>
            <p>
                Distância Total: {distanciaDisplay}
            </p>
            {segmentosDisplay}
            {mensagemInformativa}
        </div>
    );
}


export default ResumoRota;