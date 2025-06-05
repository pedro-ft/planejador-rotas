import React, { useState, useId } from 'react';
import styles from './AdicionarDestino.module.css'

function AdicionarDestino({ aoAdicionar, aoDispararAlerta }) {
    const [nomeDestino, setNomeDestino] = useState('');
    const [paisDestino, setPaisDestino] = useState('');
    const [enderecoDestino, setEnderecoDestino] = useState('');

    const idNome = useId();
    const idPais = useId();
    const idEndereco = useId();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!nomeDestino.trim() || !paisDestino.trim()) {
            if (aoDispararAlerta) {
                aoDispararAlerta("Atenção", "Por favor, informe o nome da Cidade e o País.");
            } else {
                alert("Por favor, informe o Nome da Cidade e o País.");
            }
            return;
        }
        aoAdicionar({
            nome: nomeDestino,
            pais: paisDestino,
            endereco: enderecoDestino });
        setNomeDestino('');
        setPaisDestino('');
        setEnderecoDestino('');
    };

    return (
        <form onSubmit={handleSubmit} className={styles.formAdicionarDestino}>
            <div className={styles.formGroup}>
                <label htmlFor={idNome} className={styles.label}>Cidade</label>
                <input
                    type="text"
                    id={idNome}
                    value={nomeDestino}
                    onChange={(e) => setNomeDestino(e.target.value)}
                    placeholder="Ex: Salvador, Paris, Tóquio"
                    className={styles.inputField}
                />
            </div>
            <div className={styles.formGroup}>
                <label htmlFor={idPais} className={styles.label}>País</label>
                <input
                    type="text"
                    id={idPais}
                    value={paisDestino}
                    onChange={(e) => setPaisDestino(e.target.value)}
                    placeholder="Ex: Brasil, França, Japão"
                    className={styles.inputField}
                />
            </div>
            <div className={styles.formGroup}>
                <label htmlFor={idEndereco} className={styles.label}>Endereço ou Nome do Local</label>
                <input
                    type="text"
                    id={idEndereco}
                    value={enderecoDestino}
                    onChange={(e) => setEnderecoDestino(e.target.value)}
                    placeholder="Ex: Rua das Palmeiras, 123 ou Torre Eiffel"
                    className={styles.inputField}
                />
            </div>
            <button type="submit" className={styles.submitButton}>
                + Adicionar Destino à Rota
            </button>
        </form>
    );
}

export default AdicionarDestino;