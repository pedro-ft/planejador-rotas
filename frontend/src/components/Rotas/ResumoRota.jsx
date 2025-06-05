import React from 'react';
import { formatarDistancia, formatarDuracao } from '../../utils/formatacao.js'
import styles from './ResumoRota.module.css'
import iconeRelogio from '../../assets/tempoIcon.svg'
import iconeDistancia from '../../assets/distanciaIcon.svg'

function ResumoRota({ detalhesCalculados, isLoading, error, numDestinosNaRotaAtual }) {
    let conteudoPrincipal;

    if (isLoading) {
        conteudoPrincipal = (
            <>
                <p className={styles.linhaResumo}><img src={iconeRelogio} alt="Tempo" className={styles.iconeResumo} /> Tempo Total: Calculando...</p>
                <p className={styles.linhaResumo}><img src={iconeDistancia} alt="Distância" className={styles.iconeResumo} /> Distância Total: Calculando...</p>
            </>
        );
    } else if (error) {
        conteudoPrincipal = <p className={styles.textoErro}>Falha ao calcular prévia: {error}</p>;
    } else if (detalhesCalculados && detalhesCalculados.total) {
        conteudoPrincipal = (
            <>
                <p className={styles.linhaResumo}>
                    <img src={iconeRelogio} alt="Tempo" className={styles.iconeResumo} /> 
                    Tempo Total: {formatarDuracao(detalhesCalculados.total.duracaoSegundos)}
                </p>
                <p className={styles.linhaResumo}>
                    <img src={iconeDistancia} alt="Distância" className={styles.iconeResumo} /> 
                    Distância Total: {formatarDistancia(detalhesCalculados.total.distanciaMetros)}
                </p>
                {detalhesCalculados.segmentos && detalhesCalculados.segmentos.length > 0 && (
                    <div className={styles.segmentosContainer}>
                        <strong className={styles.segmentosTitulo}>Trechos:</strong>
                        <ul className={styles.listaSegmentos}>
                            {detalhesCalculados.segmentos.map((seg, idx) => (
                                <li key={idx} className={styles.itemSegmento}>
                                    <span style={{minWidth: '70px'}}>Trecho {idx + 1}:</span>
                                    <img src={iconeDistancia} alt="Distância" className={styles.iconeResumo} style={{width: '14px', height: '14px'}} /> {formatarDistancia(seg.distanciaMetros)}
                                    <span>|</span>
                                    <img src={iconeRelogio} alt="Tempo" className={styles.iconeResumo} style={{width: '14px', height: '14px'}} /> {formatarDuracao(seg.duracaoSegundos)}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </>
        );
    } else if (numDestinosNaRotaAtual >= 2) {
        conteudoPrincipal = <p className={styles.statusCalculo}>Clique em "Calcular Prévia Detalhada" para ver os totais.</p>;
    } else {
        conteudoPrincipal = <p className={styles.statusCalculo}>Adicione pelo menos dois destinos para calcular a rota.</p>;
    }

    return (
        <div className={styles.resumoContainer}>
            {conteudoPrincipal}
        </div>
    );
}


export default ResumoRota;