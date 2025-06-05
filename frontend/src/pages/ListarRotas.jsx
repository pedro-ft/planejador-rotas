import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import RouteCard from '../components/RouteCard'
import styles from './ListarRotas.module.css'
import { getRotas} from '../services/apiClient';
import Modal from '../components/Modal/Modal'

function ListarRotas() {
    const [rotas, setRotas] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        title: '',
        message: '',
        showConfirmButton: false,
        onConfirm: null,
        confirmText: "Confirmar",
        cancelText: "Cancelar",
        onCloseAction: null // Adicionado para consistência com a lógica de fechar
    });

    const abrirAlerta = (title, message) => {
        setModalConfig({
            isOpen: true, title, message,
            showConfirmButton: false, onConfirm: null, cancelText: "OK", onCloseAction: null
        });
    };

    const abrirConfirmacao = (title, message, onConfirmCallback, confirmText = "Sim", cancelText = "Não") => {
        setModalConfig({
            isOpen: true, title, message,
            showConfirmButton: true, onConfirm: onConfirmCallback, confirmText, cancelText, onCloseAction: null
        });
    };

    const fecharModal = () => {
        setModalConfig(prev => ({ ...prev, isOpen: false, onConfirm: null, onCloseAction: null }));
    };

    const fetchRotas = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const respostaApi = await getRotas();
            setRotas(respostaApi.data || []); 
        } catch (err) {
            setError(err.message);
            console.error("Falha ao buscar rotas:", err);
            setRotas([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRotas();
    }, []);

    const handleRotaDeletada = (idRotaDeletada) => {
        setRotas(prevRotas => prevRotas.filter(rota => rota._id !== idRotaDeletada));
        fetchRotas();
    };

    if (isLoading) {
        return <div className={styles.loadingMessage}>Carregando rotas...</div>;
    }

    if (error) {
        return <div className={styles.errorMessage}>Erro ao carregar rotas: {error}</div>;
    }

    return (
        <div className={styles.listarRotasPageContainer}>
            <h2 className={styles.pageTitle}>Minhas Rotas de Viagem</h2>
            {rotas.length === 0 ? (
                <p className={styles.noRotasMessage}>
                    Nenhuma rota salva ainda. Que tal <Link to="/rotas/nova">criar uma nova</Link>?
                </p>
            ) : (
                <div className={styles.rotasGrid}> 
                    {rotas.map(rota => (
                        <RouteCard 
                            key={rota._id} 
                            rota={rota} 
                            onRotaDeletada={handleRotaDeletada}
                            aoAbrirConfirmacao={abrirConfirmacao} 
                            aoAbrirAlerta={abrirAlerta}
                        />
                    ))}
                </div>
            )}
            <Modal 
                isOpen={modalConfig.isOpen}
                onClose={() => {
                    if (modalConfig.onCloseAction) {
                        modalConfig.onCloseAction();
                    }
                    fecharModal(); 
                }}
                title={modalConfig.title}
                showConfirmButton={modalConfig.showConfirmButton}
                onConfirm={modalConfig.onConfirm}
                confirmText={modalConfig.confirmText}
                cancelText={modalConfig.cancelText}
            >
                <p>{modalConfig.message}</p>
            </Modal>
        </div>
    );
}

export default ListarRotas;