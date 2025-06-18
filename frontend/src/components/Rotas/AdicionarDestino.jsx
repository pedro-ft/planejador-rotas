import React, { useId } from 'react';
import styles from './AdicionarDestino.module.css'

function AdicionarDestino({ nome, onNomeChange, pais, onPaisChange, endereco, onEnderecoChange, onSubmit, aoDispararAlerta  }) {

    const idNome = useId();
    const idPais = useId();
    const idEndereco = useId();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!nome.trim() || !pais.trim()) {
            if (aoDispararAlerta) {
                aoDispararAlerta("Atenção", "Por favor, informe o nome da Cidade e o País.");
            }
            return;
        }
        onSubmit();
    };

    return (
        <form onSubmit={handleSubmit} className={styles.formAdicionarDestino}>
            <div className={styles.formGroup}>
                <label htmlFor={idNome} className={styles.label}>Cidade</label>
                <input
                    type="text"
                    id={idNome}
                    value={nome}
                    onChange={onNomeChange}
                    placeholder="Ex: Salvador, Paris, Tóquio"
                    className={styles.inputField}
                    required
                />
            </div>
            <div className={styles.formGroup}>
                <label htmlFor={idPais} className={styles.label}>País</label>
                <input
                    type="text"
                    id={idPais}
                    value={pais}
                    onChange={onPaisChange}
                    placeholder="Ex: Brasil, França, Japão"
                    className={styles.inputField}
                    required
                />
            </div>
            <div className={styles.formGroup}>
                <label htmlFor={idEndereco} className={styles.label}>Endereço ou Nome do Local</label>
                <input
                    type="text"
                    id={idEndereco}
                    value={endereco}
                    onChange={onEnderecoChange}
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