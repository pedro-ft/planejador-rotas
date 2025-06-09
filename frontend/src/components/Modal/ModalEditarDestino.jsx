import React, { useState, useEffect } from 'react';
import styles from './ModalEditarDestino.module.css';
import Modal from './Modal'; 

function ModalEditarDestino({ destinoParaEditar, onSave, onClose }) {
    const [cidade, setCidade] = useState('');
    const [pais, setPais] = useState('');
    const [observacoes, setObservacoes] = useState('');
    const [validationError, setValidationError] = useState(''); 

    useEffect(() => {
        if (destinoParaEditar) {
            setCidade(destinoParaEditar.cidade || '');
            setPais(destinoParaEditar.pais || '');
            setObservacoes(destinoParaEditar.observacoes || '');
            setValidationError('');
        }
    }, [destinoParaEditar]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!cidade.trim() || !pais.trim()) {
            setValidationError("Cidade e País são campos obrigatórios.");
            return;
        }
        setValidationError(''); 
        onSave({
            cidade,
            pais,
            observacoes
        });
    };

    if (!destinoParaEditar) {
        return null;
    }

    return (
        <Modal
            isOpen={!!destinoParaEditar}
            onClose={onClose}
            title={`Editando Destino: ${destinoParaEditar.cidade}`}
            showFooter = {false}
        >
            <form onSubmit={handleSubmit} className={styles.formEdicao}>
                <div className={styles.formGroup}>
                    <label htmlFor="edit-cidade" className={styles.label}>Cidade</label>
                    <input
                        id="edit-cidade"
                        type="text"
                        value={cidade}
                        onChange={(e) => setCidade(e.target.value)}
                        className={styles.inputField}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="edit-pais" className={styles.label}>País</label>
                    <input
                        id="edit-pais"
                        type="text"
                        value={pais}
                        onChange={(e) => setPais(e.target.value)}
                        className={styles.inputField}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="edit-observacoes" className={styles.label}>Endereço ou Observações</label>
                    <input
                        id="edit-observacoes"
                        type="text"
                        value={observacoes}
                        onChange={(e) => setObservacoes(e.target.value)}
                        className={styles.inputField}
                    />
                </div>
                {validationError && (
                    <p className={styles.errorMessage}>{validationError}</p>
                )}
                <div className={styles.buttonContainer}>
                    <button type="button" onClick={onClose} className={styles.cancelButton}>
                        Cancelar
                    </button>
                    <button type="submit" className={styles.saveButton}>
                        Salvar Alterações
                    </button>
                </div>
            </form>
        </Modal>
    );
}

export default ModalEditarDestino;