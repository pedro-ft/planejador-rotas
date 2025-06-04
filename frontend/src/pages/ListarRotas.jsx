import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import RouteCard from '../components/RouteCard'
import styles from './ListarRotas.module.css'
import { getRotas, deletarRota as apiDeletarRota } from '../services/apiClient';

function ListarRotas() {
    const [rotas, setRotas] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

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
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default ListarRotas;