import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRotaPorId, atualizarRota, criarDestino as apiCriarDestino, deletarDestino as apiDeletarDestino, obterCalculoDetalhesRota } from '../services/apiClient';
import styles from './EditarRotas.module.css';

import InputNome from '../components/Rotas/InputNome';
import AdicionarDestino from '../components/Rotas/AdicionarDestino';
import ListaDestinos from '../components/Rotas/ListaDestinos';
import ResumoRota from '../components/Rotas/ResumoRota';

function EditarRotaPage() {
    const { idRota } = useParams();
    const navigate = useNavigate();

    const [nomeRota, setNomeRota] = useState('');
    const [destinosNaRota, setDestinosNaRota] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [rotaOriginal, setRotaOriginal] = useState(null);


    const [previaDetalhes, setPreviaDetalhes] = useState(null);
    const [isLoadingPrevia, setIsLoadingPrevia] = useState(false);
    const [errorPrevia, setErrorPrevia] = useState(null);
    const [destinosModificadosDesdeLoad, setDestinosModificadosDesdeLoad] = useState(false);

    useEffect(() => {
        const carregarDadosRota = async () => {
            if (!idRota) return;
            setIsLoading(true);
            setError(null);
            setPreviaDetalhes(null);
            setErrorPrevia(null);
            try {
                const respostaApi = await getRotaPorId(idRota);
                if (respostaApi && respostaApi.data) {
                    setRotaOriginal(respostaApi.data);
                    setNomeRota(respostaApi.data.nome);
                    setDestinosNaRota(respostaApi.data.destinos || []);
                    setDestinosModificadosDesdeLoad(false); 
                } else {
                    throw new Error("Rota não encontrada ou resposta inválida da API.");
                }
            } catch (err) {
                console.error("Erro ao buscar dados da rota:", err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        carregarDadosRota();
    }, [idRota]);

    const invalidarPrevia = () => {
        setPreviaDetalhes(null);
        setErrorPrevia(null);
        setDestinosModificadosDesdeLoad(true);
    };

    const handleMudarNomeRota = (novoNome) => {setNomeRota(novoNome)};

    const handleAdicionarDestino = async (dadosFormularioDestino) => {
    const dadosParaApi = {
        cidade: dadosFormularioDestino.nome,
        pais: dadosFormularioDestino.pais,
        observacoes: dadosFormularioDestino.endereco 
    };
    try {
        const respostaApi = await apiCriarDestino(dadosParaApi);
        setDestinosNaRota(destinosAnteriores => [...destinosAnteriores, respostaApi.data]);
        invalidarPrevia();
    } catch (e) {
        alert(e.message);
        console.error("Erro ao adicionar novo destino em EditarRotaPage:", e);
    }
};

    
    const handleDeletarDestino = async (idDoDestinoParaRemover) => {
        if (!window.confirm("Tem certeza que deseja remover este destino da rota E APAGÁ-LO PERMANENTEMENTE do sistema? Esta ação não pode ser desfeita.")) {
            return;
        }
        try {
            await apiDeletarDestino(idDoDestinoParaRemover); 
            setDestinosNaRota(destinosAnteriores =>
                destinosAnteriores.filter(destino => destino._id !== idDoDestinoParaRemover)
            );
            invalidarPrevia();
        } catch (error) {
            console.error("Erro ao deletar destino:", error);
            alert(`Erro ao tentar deletar o destino: ${error.message}. Verifique se ele ainda está na lista.`);
        }
    };

    const handleCalcularPrevia = async () => {
        if (destinosNaRota.length < 2) {
            alert("Adicione pelo menos dois destinos para calcular a prévia da rota.");
            return;
        }
        const coordenadasParaCalculo = destinosNaRota.map(d => {
            if (typeof d.lon !== 'number' || typeof d.lat !== 'number') {
                throw new Error(`Destino "${d.nome || d.cidade}" não possui coordenadas válidas.`);
            }
            return [d.lon, d.lat];
        });

        setIsLoadingPrevia(true);
        setErrorPrevia(null);
        setPreviaDetalhes(null);
        try {
            const respostaApi = await obterCalculoDetalhesRota(coordenadasParaCalculo);
            setPreviaDetalhes(respostaApi.data);
        } catch (error) {
            setErrorPrevia(error.message || "Falha ao calcular prévia.");
            setPreviaDetalhes(null);
        } finally {
            setIsLoadingPrevia(false);
        }
    };


    const handleSalvarAlteracoes = async () => {
        if (!nomeRota.trim()) { alert("O nome da rota não pode ser vazio."); return; }

        const destinosAtualizadosParaApi = destinosNaRota.map(destino => ({
            ...destino, 
            nomeDaRotaPertencente: nomeRota 
        }));
         const dadosRotaAtualizada = {
            nome: nomeRota,
            destinos: destinosAtualizadosParaApi, 
        };
        try {
            setIsLoading(true);
            const respostaApi = await atualizarRota(idRota, dadosRotaAtualizada);
            alert(`Rota "${respostaApi.data.nome}" atualizada com sucesso!`);
            navigate('/');
        } catch (error) {
            console.error("Erro ao atualizar rota:", error);
            alert(`Erro ao atualizar rota: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    let detalhesParaExibirNoResumo = null;
    if (previaDetalhes) {
        detalhesParaExibirNoResumo = previaDetalhes;
    } else if (!destinosModificadosDesdeLoad && rotaOriginal && rotaOriginal.detalhesCalculados && !rotaOriginal.detalhesCalculados.error) {
        detalhesParaExibirNoResumo = rotaOriginal.detalhesCalculados;
    }

    if (isLoading && !rotaOriginal) {
        return <div className={styles.loadingMessage}>Carregando dados da rota...</div>;
    }

    if (error) {
        return (
            <div className={styles.paginaEditarRota}>
                <div className={styles.errorMessage}>Erro ao carregar rota: {error}</div>
                <button className={styles.voltarButton} onClick={() => navigate('/')}>&larr; Voltar para Lista</button>
            </div>
        );
    }

     const moverDestino = (idDoDestino, direcao) => {
        setDestinosNaRota(destinosAtuais => {
            const index = destinosAtuais.findIndex(d => d._id === idDoDestino);

            if (index === -1) return destinosAtuais;

            if (direcao === 'cima' && index === 0) return destinosAtuais;
            if (direcao === 'baixo' && index === destinosAtuais.length - 1) return destinosAtuais;

            const novosDestinos = [...destinosAtuais];
            const destinoMovido = novosDestinos.splice(index, 1)[0];

            if (direcao === 'cima') {
                novosDestinos.splice(index - 1, 0, destinoMovido);
                invalidarPrevia();
            } else {
                novosDestinos.splice(index + 1, 0, destinoMovido);
                invalidarPrevia();
            }
            return novosDestinos;
        });
    };

    const handleMoverDestinoParaCima = (idDoDestino) => {
        moverDestino(idDoDestino, 'cima');
    };

    const handleMoverDestinoParaBaixo = (idDoDestino) => {
        moverDestino(idDoDestino, 'baixo');
    };

    return (
        <div className={styles.paginaEditarRota}>
            <button className={styles.voltarButton} onClick={() => navigate('/')}>
                &larr; Voltar para Lista
            </button>
            <h2 className={styles.pageTitle}>Editar Rota</h2>
            <div className={styles.sectionCard}>
                <h3 className={styles.sectionTitle}>Nome da Rota</h3>
                <InputNome valor={nomeRota} aoMudar={handleMudarNomeRota} />
            </div>

            <div className={styles.sectionCard}>
                <h3 className={styles.sectionTitle}>Adicionar Destino</h3>
                <AdicionarDestino aoAdicionar={handleAdicionarDestino} /> 
            </div>

            <div className={styles.sectionCard}>
                {/* O ListaDestinosDaRota já tem um div wrapper, podemos passar o título como prop ou adicionar aqui */}
                <h3 className={styles.sectionTitle}>Destinos da Rota ({destinosNaRota.length})</h3>
                <ListaDestinos destinos={destinosNaRota} aoDeletar={handleDeletarDestino} aoMoverParaCima={handleMoverDestinoParaCima}  aoMoverParaBaixo={handleMoverDestinoParaBaixo}/>
            </div>

            <div className={styles.sectionCard}>
                <h3 className={styles.sectionTitle}>Resumo da Rota</h3>
                <ResumoRota 
                    detalhesCalculados={detalhesParaExibirNoResumo}
                    isLoading={isLoadingPrevia} 
                    error={errorPrevia}         
                    numDestinosNaRotaAtual={destinosNaRota.length}
                />
                {destinosNaRota.length >= 2 && (
                    <button 
                        onClick={handleCalcularPrevia} 
                        disabled={isLoadingPrevia}
                        // className={styles.calcularPreviaButton}
                        style={{ marginTop: '15px', padding: '10px 15px', backgroundColor: '#88c0d0', /* ... */ }}
                    >
                        {isLoadingPrevia ? 'Calculando Prévia...' : 'Calcular Prévia Detalhada'}
                    </button>
                )}
            </div>

            <div className={styles.saveButtonContainer}>
                <button 
                    onClick={handleSalvarAlteracoes} 
                    disabled={isLoading}
                    className={styles.saveButton}
                >
                    {isLoading ? 'Atualizando...' : 'Atualizar Rota'}
                </button>
            </div>
        </div>
    );
}

export default EditarRotaPage;