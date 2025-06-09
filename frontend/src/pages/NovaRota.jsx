import React, { useState} from 'react';
import { useNavigate } from 'react-router-dom';
import InputNome from '../components/Rotas/InputNome';
import AdicionarDestino from '../components/Rotas/AdicionarDestino';
import ListaDestinos from '../components/Rotas/ListaDestinos';
import ResumoRota from '../components/Rotas/ResumoRota';
import Modal from '../components/Modal/Modal';
import ModalEditarDestino from '../components/Modal/ModalEditarDestino'
import { criarDestino as apiCriarDestino, deletarDestino as apiDeletarDestino, criarRota as apiCriarRota, obterCalculoDetalhesRota, atualizarDestino as apiAtualizarDestino } from '../services/apiClient';
import styles from './NovaRota.module.css';

function NovaRota() {
    const navigate = useNavigate();
    const [nomeRota, setNomeRota] = useState('');
    const [destinosNaRota, setDestinosNaRota] = useState([]);
    const [previaDetalhes, setPreviaDetalhes] = useState(null);
    const [isLoadingPrevia, setIsLoadingPrevia] = useState(false);
    const [errorPrevia, setErrorPrevia] = useState(null);
    const [destinoEmEdicao, setDestinoEmEdicao] = useState(null);

    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        title: '',
        message: '',
        showConfirmButton: false,
        onConfirm: null,
        confirmText: "Confirmar",
        cancelText: "Cancelar"
    });

    const abrirAlerta = (title, message) => {
        setModalConfig({
            isOpen: true,
            title: title,
            message: message,
            showConfirmButton: false, 
            onConfirm: null,
            cancelText: "OK"
        });
    };

    const abrirConfirmacao = (title, message, onConfirmCallback, confirmText = "Sim", cancelText = "Não") => {
        setModalConfig({
            isOpen: true,
            title: title,
            message: message,
            showConfirmButton: true,
            onConfirm: onConfirmCallback,
            confirmText: confirmText,
            cancelText: cancelText
        });
    };

    const fecharModal = () => {
        setModalConfig(prev => ({ ...prev, isOpen: false, onConfirm: null })); // Limpa onConfirm
    };


    const invalidarPrevia = () => {
        setPreviaDetalhes(null);
        setErrorPrevia(null);
    };

    const handleAdicionarDestino = async (dadosNovoDestino) => {
        const dadosParaApi = {
            cidade: dadosNovoDestino.nome,
            pais: dadosNovoDestino.pais,
            observacoes: dadosNovoDestino.endereco,
            nomeDaRotaPertecente: nomeRota
        };
        try {
            const respostaApi = await apiCriarDestino(dadosParaApi);
            setDestinosNaRota(destinosAnteriores => [...destinosAnteriores, respostaApi.data]);
            invalidarPrevia()
        } catch (error) {
            abrirAlerta("Erro", `Erro ao adicionar destino: ${error.message}`);
        }
    };

    const handleDeletarDestino = async (idDoDestino, nomeDestino) => {
                abrirConfirmacao(
                    "Confirmar Exclusão", 
                    `Tem certeza que deseja remover o destino da rota?`,
                    async () => { 
                try {
                    await apiDeletarDestino(idDoDestino);
                    setDestinosNaRota(destinosAnteriores => 
                        destinosAnteriores.filter(destino => destino._id !== idDoDestino)
                    );
                    invalidarPrevia()
                } catch (error) {
                    abrirAlerta("Erro", `Erro ao deletar destino: ${error.message}`);
                }
            }
        )
    };

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
            } else { 
                novosDestinos.splice(index + 1, 0, destinoMovido);
            }
            invalidarPrevia(); 
            return novosDestinos;
        });
    };

    const handleMoverDestinoParaCima = (idDoDestino) => {
        moverDestino(idDoDestino, 'cima');
    };

    const handleMoverDestinoParaBaixo = (idDoDestino) => {
        moverDestino(idDoDestino, 'baixo');
    };

    const handleMudarNomeRota = (novoNome) => {
        setNomeRota(novoNome);
    };
    
    const handleSalvarRota = async () => {
        if (!nomeRota.trim()) {
            abrirAlerta("Atenção", "Por favor, dê um nome para a sua rota antes de salvar.");
            return;
        }
        if (destinosNaRota.length === 0) {
            abrirAlerta("Atenção", "Adicione pelo menos um destino à rota antes de salvar.");
            return;
        }
        const dadosNovaRotaParaApi = {
            nome: nomeRota,
            destinos: destinosNaRota 
        };
        try {
            const respostaApi = await apiCriarRota(dadosNovaRotaParaApi); 
            setNomeRota('');
            setDestinosNaRota([]);
            navigate('/');
        } catch (error) {
            abrirAlerta("Erro", `Erro ao salvar rota: ${error.message}`);
        }
    };

    const handleCalcularPrevia = async () => {
        if (destinosNaRota.length < 2) {
            abrirAlerta("Atenção", "Adicione pelo menos dois destinos para calcular a prévia da rota.");
            return;
        }

        const coordenadasParaCalculo = destinosNaRota.map(d => {
            if (typeof d.lon !== 'number' || typeof d.lat !== 'number') {
                console.error("Destino sem coordenadas válidas:", d);
                throw new Error("Alguns destinos na rota não possuem coordenadas válidas para cálculo.");
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
            console.error("Erro ao calcular prévia da rota:", error);
            setErrorPrevia(error.message || "Falha ao calcular prévia.");
            setPreviaDetalhes(null); 
        } finally {
            setIsLoadingPrevia(false);
        }
    };

    const handleAbrirModalEdicao = (destino) => {
        setDestinoEmEdicao(destino);
    };

    const handleFecharModalEdicao = () => {
        setDestinoEmEdicao(null);
    };

    const handleSalvarEdicaoDestino = async (dadosEditados) => {
        if (!destinoEmEdicao) return;

        try {
            const respostaApi = await apiAtualizarDestino(destinoEmEdicao._id, dadosEditados);
            const destinoAtualizado = respostaApi.data;

            setDestinosNaRota(destinosAtuais => 
                destinosAtuais.map(d => 
                    d._id === destinoAtualizado._id ? destinoAtualizado : d
                )
            );
            
            invalidarPrevia();
            handleFecharModalEdicao();
            abrirAlerta("Sucesso", "Destino atualizado com sucesso!");
        } catch (error) {
            console.error("Erro ao atualizar destino:", error);
            abrirAlerta("Erro", `Erro ao atualizar destino: ${error.message}`);
        }
    };

    return (
       <div className={styles.paginaNovaRota}> 
            <div className={styles.pageHeaderContainer}>
                <button 
                        onClick={() => navigate('/')} 
                        className={styles.voltarButton}
                >
                        &larr; Voltar para Lista
                </button>
                <h2 className={styles.pageTitle}>Adicionar Nova Rota</h2>
            </div>   

            <div className={styles.sectionCard}>
                <h3 className={styles.sectionTitle}>Nome da Rota</h3>
                <InputNome valor={nomeRota} aoMudar={handleMudarNomeRota} />
            </div>

            <div className={styles.sectionCard}>
                <h3 className={styles.sectionTitle}>Adicionar Destino</h3>
                <AdicionarDestino aoAdicionar={handleAdicionarDestino} aoDispararAlerta={abrirAlerta} />
            </div>

            <div className={styles.sectionCard}>
                <h3 className={styles.sectionTitle}>Destinos da Rota ({destinosNaRota.length})</h3>
                <ListaDestinos destinos={destinosNaRota} aoDeletar={handleDeletarDestino} aoEditar={handleAbrirModalEdicao} aoMoverParaCima={handleMoverDestinoParaCima} aoMoverParaBaixo={handleMoverDestinoParaBaixo}/>
            </div>
            
            <div className={styles.sectionCard}>
                <h3 className={styles.sectionTitle}>Resumo da Rota</h3>
                <ResumoRota 
                    detalhesCalculados={previaDetalhes}
                    isLoading={isLoadingPrevia}
                    error={errorPrevia}
                    numDestinosNaRotaAtual={destinosNaRota.length}
                />
                <div className={styles.ButtonContainer}>
                    {destinosNaRota.length >= 2 && ( 
                        <button 
                            onClick={handleCalcularPrevia} 
                            disabled={isLoadingPrevia}
                            className={styles.calcularPreviaButton}
                        >
                            {isLoadingPrevia ? 'Calculando Prévia...' : 'Calcular Prévia Detalhada'}
                        </button>
                    )}
                    <button onClick={handleSalvarRota} className={styles.saveButton}>
                        Salvar Rota
                    </button>
                </div>
            </div>
            <ModalEditarDestino 
                destinoParaEditar={destinoEmEdicao}
                onSave={handleSalvarEdicaoDestino}
                onClose={handleFecharModalEdicao}
            />
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

export default NovaRota;