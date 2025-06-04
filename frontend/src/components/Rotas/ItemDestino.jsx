import React from 'react'
import styles from './ItemDestino.module.css'
import setaCima from '../../assets/setaCima.svg'
import setaBaixo from '../../assets/setaBaixo.svg'
import excluirIcon from '../../assets/excluirIcon.svg'

function ItemDestino({ destino, aoDeletar, aoReordenarCima, aoReordenarBaixo }) {
    if (!destino || !destino._id) {
        return null; 
    }

    return (
    <li className={styles.itemDestino}>
            <div className={styles.destinoInfo}>
                <span className={styles.destinoNome}>{destino.nome || destino.cidade || 'Nome não disponível'}</span><span className={styles.destinoNome}>{destino.pais || 'Nome não disponível'}</span>
                <span className={styles.destinoSubtitulo}>{destino.endereco || destino.observacoes || '(Sem detalhes adicionais)'}</span>
            </div>
            <div className={styles.itemActions}>
                <img 
                    src={setaCima} 
                    alt="Reordenar para Cima" 
                    className={styles.actionIcon} 
                    onClick={() => aoReordenarCima && aoReordenarCima(destino._id)} 
                    title="Mover para cima"
                />
                <img 
                    src={setaBaixo} 
                    alt="Reordenar para Baixo" 
                    className={styles.actionIcon} 
                    onClick={() => aoReordenarBaixo && aoReordenarBaixo(destino._id)}
                    title="Mover para baixo"
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