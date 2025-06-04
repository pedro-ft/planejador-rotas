import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { deletarRota as apiDeletarRota } from '../services/apiClient';
import styles from './RouteCard.module.css';
import editarIcon from '../assets/editarIcon.svg';
import excluirIcon from '../assets/excluirIcon.svg';
import tempoIcon from '../assets/tempoIcon.svg';
import distanciaIcon from '../assets/distanciaIcon.svg';

function RouteCard({ rota, onRotaDeletada }) {
    const navigate = useNavigate();

    if (!rota) return null;

    // Estimativa simples de tempo/distância (igual à de ResumoDaRota)
    const numeroDeDestinos = rota.destinos ? rota.destinos.length : 0;
    const numeroDeTrechos = numeroDeDestinos > 1 ? numeroDeDestinos - 1 : 0;
    const tempoEstimadoTotalMinutos = numeroDeTrechos * 20;
    const distanciaEstimadaTotalKm = numeroDeTrechos * 15;

    const handleEdit = () => {
        //navigate(`/rotas/editar/${rota._id}`);
        alert("Funcionalidade de editar rota ainda não implementada.");
    };

    const handleDelete = async () => {
        if (window.confirm(`Tem certeza que deseja excluir a rota "${rota.nome}"?`)) {
            try {
                await apiDeletarRota(rota._id);
                if (onRotaDeletada) {
                    onRotaDeletada(rota._id);
                }
                alert(`Rota "${rota.nome}" excluída com sucesso!`);
            } catch (error) {
                console.error("Falha ao deletar rota:", error);
                alert(`Erro ao deletar rota: ${error.message}`);
            }
        }
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
                <p className={styles.destinationsTitle}>Destinos ({numeroDeDestinos}):</p>
                <ul className={styles.destinationsList}>
                    {rota.destinos && rota.destinos.slice(0, 3).map((destino, index) => (
                        <li key={destino._id || index}>
                            {destino.nome || destino.cidade}, {destino.pais}
                            {destino.observacoes ? <span className={styles.destinationDetail}> ({destino.observacoes})</span> : ''}
                        </li>
                    ))}
                    {numeroDeDestinos > 5 && <li>... e mais {numeroDeDestinos - 5}.</li>}
                </ul>
            </div>

            <div className={styles.summarySection}>
                <span>
                    <img src={tempoIcon} alt="Tempo" className={styles.summaryIcon} />
                    Tempo Total: {tempoEstimadoTotalMinutos} min
                </span>
                <span>
                    <img src={distanciaIcon} alt="Distância" className={styles.summaryIcon} />
                    Distância Total: {distanciaEstimadaTotalKm} km
                </span>
            </div>
            <div className={styles.creationDate}>
                Criada em: {new Date(rota.createdAt).toLocaleDateString()}
            </div>
        </div>
    );
}

export default RouteCard;