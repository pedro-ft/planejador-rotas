import React from 'react'
import styles from './ItemDestino.module.css'
import setaCima from '../../assets/setaCima.svg'
import setaBaixo from '../../assets/setaBaixo.svg'
import excluirIcon from '../../assets/excluirIcon.svg'
import editarIcon from '../../assets/editarIcon.svg'

function ItemDestino({ destino, aoDeletar, aoEditar, aoReordenarCima, aoReordenarBaixo, index, totalDestinos }) {
    if (!destino || !destino._id) {
        return null; 
    }

    const podeMoverParaCima = index > 0;
    const podeMoverParaBaixo = index < totalDestinos - 1;

    return (
    <li className={styles.itemDestino}>
            <div className={styles.destinoInfo}>
                <span className={styles.destinoNome}>Cidade: {destino.cidade || 'Nome não disponível'}</span>
                <span className={styles.destinoNome}>País: {destino.pais || 'Pais não disponível'}</span>
                <span className={styles.destinoSubtitulo}>Endereço: {destino.observacoes || '(Sem detalhes adicionais)'}</span>
            </div>
            <div className={styles.itemActions}>
                {podeMoverParaCima ? (
                    <img 
                        src={setaCima} 
                        alt="Reordenar para Cima" 
                        className={styles.actionIcon} 
                        onClick={() => aoReordenarCima && aoReordenarCima(destino._id)} 
                        title="Mover para cima"
                    />
                ) : (
                    <span style={{ width: '20px', height: '20px'}}></span>
                )}
                {podeMoverParaBaixo ? (
                    <img 
                        src={setaBaixo} 
                        alt="Reordenar para Baixo" 
                        className={styles.actionIcon} 
                        onClick={() => aoReordenarBaixo && aoReordenarBaixo(destino._id)}
                        title="Mover para baixo"
                    />
                ) : (
                    <span style={{ width: '20px', height: '20px'}}></span>
                )}    
                <img 
                    src={editarIcon} 
                    alt="Editar Destino" 
                    className={styles.actionIcon} 
                    onClick={() => aoEditar(destino)}
                    title="Editar detalhes do destino"
                />
                <img 
                    src={excluirIcon} 
                    alt="Excluir Destino" 
                    className={styles.actionIcon} 
                    onClick={() => aoDeletar(destino._id)}
                    title="Excluir destino da rota"
                />
            </div>
        </li>
    );
}

export default ItemDestino