import React from 'react'
import ItemDestino from './ItemDestino'
import styles from './ListaDestinos.module.css';

function ListaDestinos({ destinos, aoDeletar, aoMoverParaCima, aoMoverParaBaixo }) {
    if (destinos.length === 0) {
        return <p className={styles.listaVaziaMensagem}>Nenhum destino adicionado ainda.</p>;
    }
    return (
        <ul className={styles.lista}>
            {destinos.map((destino, index) => (
                <ItemDestino 
                    key={destino._id} 
                    destino={destino} 
                    aoDeletar={aoDeletar} 
                    aoReordenarCima={aoMoverParaCima}     
                    aoReordenarBaixo={aoMoverParaBaixo} 
                    index={index}      
                    totalDestinos={destinos.length}
                />
            ))}
        </ul>
    );
}

export default ListaDestinos