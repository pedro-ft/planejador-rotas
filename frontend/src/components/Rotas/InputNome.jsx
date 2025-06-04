import React from 'react';
import styles from './InputNome.module.css'

function InputNome({ valor, aoMudar }) {
    return (
        <div className={styles.inputContainer}>
            <input
                type="text"
                id="inputNomeRota"
                value={valor}
                onChange={(e) => aoMudar(e.target.value)}
                placeholder="Ex: Viagem de Férias, Entregas da Manhã"
                className={styles.inputField}
            />
        </div>
    );
}

export default InputNome;