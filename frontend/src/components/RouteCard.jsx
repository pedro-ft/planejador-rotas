import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { deletarRota as apiDeletarRota } from '../services/apiClient';
import { formatarDistancia, formatarDuracao } from '../utils/formatacao';
import styles from './RouteCard.module.css';
import editarIcon from '../assets/editarIcon.svg';
import excluirIcon from '../assets/excluirIcon.svg';
import tempoIcon from '../assets/tempoIcon.svg';
import distanciaIcon from '../assets/distanciaIcon.svg';

function RouteCard({ rota, onRotaDeletada, aoAbrirConfirmacao, aoAbrirAlerta }) {
    const navigate = useNavigate();

    if (!rota) return null;

    const detalhesValidos = rota.detalhesCalculados && !rota.detalhesCalculados.error;
    const totalCalculado = detalhesValidos ? rota.detalhesCalculados.total : null;
    const segmentosCalculados = detalhesValidos ? rota.detalhesCalculados.segmentos : [];

    const tempoDisplay = totalCalculado ? formatarDuracao(totalCalculado.duracaoSegundos) : null;
    const distanciaDisplay = totalCalculado ? formatarDistancia(totalCalculado.distanciaMetros) : null;

    const handleEdit = () => {
        navigate(`/rotas/editar/${rota._id}`);
    };
    const handleDelete = async () => {
        aoAbrirConfirmacao(
            "Confirmar Exclusão de Rota",
            `Tem certeza que deseja excluir a rota?`,
            async () => {
                try {
                    await apiDeletarRota(rota._id);
                    if (onRotaDeletada) {
                        onRotaDeletada(rota._id);
                    }
                } catch (error) {
                    console.error("Falha ao deletar rota:", error);
                    aoAbrirAlerta("Erro na Exclusão", `Erro ao deletar rota: ${error.message}`);
                }
            }
        )
    };

    return (
        <div className={styles.routeCard}>
            <div className={styles.cardHeader}>
                <h3 className={styles.routeName}>{rota.nome}</h3>
                <div className={styles.actions}>
                    <button onClick={handleEdit} className={styles.actionButton} title="Editar Rota">
                        <img src={editarIcon} alt="Editar" className={styles.actionIcon} />
                    </button>
                    <button onClick={handleDelete} className={styles.actionButton} title="Deletar Rota">
                        <img src={excluirIcon} alt="Deletar" className={styles.actionIcon} />
                    </button>
                </div>
            </div>

            <div className={styles.destinationsSection}>
                <p className={styles.destinationsTitle}>Destinos ({rota.destinos ? rota.destinos.length : 0}):</p>
                <ul className={styles.destinationsList}>
                    {rota.destinos && rota.destinos.slice(0, 5).map((destino, index) => (
                        <li key={destino._id || index}>
                            {destino.nome || destino.cidade}, {destino.pais}
                            {destino.observacoes ? <span className={styles.destinationDetail}> ({destino.observacoes})</span> : ''}
                        </li>
                    ))}
                    {rota.destinos && rota.destinos.length > 5 && <li>... e mais {rota.destinos.length - 5}.</li>}
                </ul>
            </div>

            {detalhesValidos && segmentosCalculados && segmentosCalculados.length > 0 && (
                <div className={styles.segmentsSection}>
                    <p className={styles.segmentsTitle}>Trechos da Rota:</p>
                    <ul className={styles.segmentsList}>
                        {segmentosCalculados.map((segmento, index) => (
                            <li key={index}>
                                Trecho {index + 1}: 
                                <img src={distanciaIcon} alt="Distância" className={styles.inlineSummaryIcon} /> {formatarDistancia(segmento.distanciaMetros)} 
                                <span style={{margin: "0 5px"}}>|</span>
                                <img src={tempoIcon} alt="Tempo" className={styles.inlineSummaryIcon} /> {formatarDuracao(segmento.duracaoSegundos)}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {rota.detalhesCalculados && rota.detalhesCalculados.error && (
                <p className={styles.calculationError}>
                    Aviso: Não foi possível calcular os detalhes da rota. Pois ela ultrapassou o limite de 6000km.
                </p>
            )}

            <div className={styles.summarySection}>
                <span>
                    <img src={tempoIcon} alt="Tempo" className={styles.summaryIcon} />
                    Tempo Total: {tempoDisplay}
                </span>
                <span>
                    <img src={distanciaIcon} alt="Distância" className={styles.summaryIcon} />
                    Distância Total: {distanciaDisplay}
                </span>
            </div>
            <div className={styles.creationDate}>
                Criada em: {new Date(rota.createdAt).toLocaleDateString()}
            </div>
        </div>
    );
}

export default RouteCard;