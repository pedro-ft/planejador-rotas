import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRotaPorId, atualizarRota, criarDestino as apiCriarDestino, deletarDestino as apiDeletarDestino } from '../services/apiClient';
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
    const [rotaOriginalNome, setRotaOriginalNome] = useState('');

    useEffect(() => {
        const carregarDadosRota = async () => {
            if (!idRota) return;
            setIsLoading(true);
            setError(null);
            try {
                const respostaApi = await getRotaPorId(idRota);
                if (respostaApi && respostaApi.data) {
                    setRotaOriginalNome(respostaApi.data.nome);
                    setNomeRota(respostaApi.data.nome);
                    setDestinosNaRota(respostaApi.data.destinos || []);
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

    // ... (suas funções handleMudarNomeRota, handleAdicionarDestino, handleDeletarDestino - sem mudanças na lógica interna por enquanto) ...
    const handleMudarNomeRota = (novoNome) => setNomeRota(novoNome);
    const handleAdicionarDestino = async (dadosFormularioDestino) => { /* ... sua lógica ... */ try { const r = await apiCriarDestino({cidade: dadosFormularioDestino.nome, pais: dadosFormularioDestino.pais, observacoes: dadosFormularioDestino.observacoes}); setDestinosNaRota(d => [...d, r.data]);} catch(e){alert(e.message);}};
    
    const handleDeletarDestino = async (idDoDestinoParaRemover) => {
        if (!window.confirm("Tem certeza que deseja remover este destino da rota E APAGÁ-LO PERMANENTEMENTE do sistema? Esta ação não pode ser desfeita.")) {
            return;
        }

        try {
            await apiDeletarDestino(idDoDestinoParaRemover); 
            setDestinosNaRota(destinosAnteriores =>
                destinosAnteriores.filter(destino => destino._id !== idDoDestinoParaRemover)
            );

            alert("Destino removido da rota e apagado do sistema com sucesso!");

        } catch (error) {
            console.error("Erro ao deletar destino:", error);
            alert(`Erro ao tentar deletar o destino: ${error.message}. Verifique se ele ainda está na lista.`);
        }
    };


    const handleSalvarAlteracoes = async () => {
        if (!nomeRota.trim()) { alert("O nome da rota não pode ser vazio."); return; }

        const destinosAtualizadosParaApi = destinosNaRota.map(destino => ({
            ...destino, // Mantém todos os outros campos do destino
            nomeDaRotaPertencente: nomeRota // Define/atualiza para o nome da rota atual
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

    if (isLoading && !rotaOriginalNome) { // Mostra carregando só no load inicial
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
            } else { // direcao === 'baixo'
                novosDestinos.splice(index + 1, 0, destinoMovido);
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

            {/* Cada seção agora pode ser envolvida por um div com styles.sectionCard */}
            <div className={styles.sectionCard}>
                {/* O InputNomeRota já tem um div wrapper, mas podemos adicionar título aqui */}
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
                <h3 className={styles.sectionTitle}>Resumo da Rota (Estimado)</h3>
                <ResumoRota destinos={destinosNaRota} />
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