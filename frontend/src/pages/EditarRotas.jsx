import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRotaPorId, atualizarRota, criarDestino as apiCriarDestino, deletarDestino as apiDeletarDestino, obterCalculoDetalhesRota, atualizarDestino as apiAtualizarDestino, obterEnderecoPorCoordenadas } from '../services/apiClient';
import styles from './EditarRotas.module.css';
import InputNome from '../components/Rotas/InputNome';
import AdicionarDestino from '../components/Rotas/AdicionarDestino';
import ListaDestinos from '../components/Rotas/ListaDestinos';
import ResumoRota from '../components/Rotas/ResumoRota';
import Modal from '../components/Modal/Modal';
import ModalEditarDestino from '../components/Modal/ModalEditarDestino';
import Mapa from '../components/Mapa/Mapa';

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
    const [destinoEmEdicao, setDestinoEmEdicao] = useState(null);
    const [destinosModificadosDesdeLoad, setDestinosModificadosDesdeLoad] = useState(false);
    const [formNome, setFormNome] = useState('');
    const [formPais, setFormPais] = useState('');
    const [formEndereco, setFormEndereco] = useState('');

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
        setDestinosModificadosDesdeLoad(true);
    };

    const handleMudarNomeRota = (novoNome) => {setNomeRota(novoNome)};

    const handleAdicionarDestino = async () => {
    const dadosParaApi = {
            cidade: formNome,
            pais: formPais,
            observacoes: formEndereco,
            nomeDaRotaPertecente: nomeRota
    };
    try {
        const respostaApi = await apiCriarDestino(dadosParaApi);
        setDestinosNaRota(destinosAnteriores => [...destinosAnteriores, respostaApi.data]);
        invalidarPrevia();
        setFormNome('');
        setFormPais('');
        setFormEndereco('');
    } catch (error) {
         abrirAlerta("Erro", `Erro ao adicionar destino: ${error.message}`);
    }
};

    
    const handleDeletarDestino = async (idDoDestinoParaRemover) => {
        abrirConfirmacao(
            "Confirmar Exclusão",
            "Tem certeza que deseja remover o destino  da rota?",
            async () => {
                try {
                    await apiDeletarDestino(idDoDestinoParaRemover); 
                    setDestinosNaRota(destinosAnteriores =>
                        destinosAnteriores.filter(destino => destino._id !== idDoDestinoParaRemover)
                    );
                    invalidarPrevia();
                } catch (error) {
                    abrirAlerta("Erro na Exclusão", `Erro ao tentar deletar o destino: ${error.message}.`);
                }
            }
        )   
    };

    const handleCalcularPrevia = async () => {
        if (destinosNaRota.length < 2) {
            abrirAlerta("Atenção", "Adicione pelo menos dois destinos para calcular a prévia da rota.");
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
        if (!nomeRota.trim()) { 
            abrirAlerta("Atenção", "O nome da rota não pode ser vazio."); 
            return; 
        }

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
            navigate('/');
        } catch (error) {
            console.error("Erro ao atualizar rota:", error);
            abrirAlerta("Erro ao Atualizar", `Erro ao atualizar rota: ${error.message}`);
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

    const handleMapClick = async (latlng) => {
            const { lat, lng: lon } = latlng; 
    
            try {
                const respostaApi = await obterEnderecoPorCoordenadas({ lat, lon });
                const dadosEndereco = respostaApi.data;
    
                if (dadosEndereco) {
                    setFormNome(dadosEndereco.cidade || '');
                    setFormPais(dadosEndereco.pais || '');
                    setFormEndereco(dadosEndereco.observacoes || '');
                }
            } catch (error) {
                console.error("Erro na geocodificação reversa:", error);
                abrirAlerta("Erro", `Não foi possível encontrar um endereço para este local: ${error.message}`);
            }
        };

    return (
        <div className={styles.paginaEditarRota}>
            <div className={styles.pageHeaderContainer}>
                <button className={styles.voltarButton} onClick={() => navigate('/')}>
                    &larr; Voltar para Lista
                </button>
                <h2 className={styles.pageTitle}>Editar Rota</h2>
            </div>

            <div className={styles.sectionCard}>
                <h3 className={styles.sectionTitle}>Nome da Rota</h3>
                <InputNome valor={nomeRota} aoMudar={handleMudarNomeRota} />
            </div>

            <div className={styles.sectionCard}>
                <h3 className={styles.sectionTitle}>Adicionar Destino por Mapa</h3>
                    <p className={styles.textoMapa}>
                        Clique em um local no mapa para preencher o formulário de destino abaixo.
                    </p> 
                <Mapa 
                    onMapClick={handleMapClick}
                    posicoesDestinos={destinosNaRota}
                />
            </div>

            <div className={styles.sectionCard}>
                <h3 className={styles.sectionTitle}>Adicionar Destino</h3>
                <AdicionarDestino 
                    nome={formNome}
                    onNomeChange={(e) => setFormNome(e.target.value)}
                    pais={formPais}
                    onPaisChange={(e) => setFormPais(e.target.value)}
                    endereco={formEndereco}
                    onEnderecoChange={(e) => setFormEndereco(e.target.value)}
                    onSubmit={handleAdicionarDestino}
                    aoDispararAlerta={abrirAlerta}                
                /> 
            </div>

            <div className={styles.sectionCard}>
                <h3 className={styles.sectionTitle}>Destinos da Rota ({destinosNaRota.length})</h3>
                <ListaDestinos destinos={destinosNaRota} aoDeletar={handleDeletarDestino} aoEditar={handleAbrirModalEdicao} aoMoverParaCima={handleMoverDestinoParaCima}  aoMoverParaBaixo={handleMoverDestinoParaBaixo}/>
            </div>

            <div className={styles.sectionCard}>
                <h3 className={styles.sectionTitle}>Resumo da Rota</h3>
                <ResumoRota 
                    detalhesCalculados={detalhesParaExibirNoResumo}
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
                    <button 
                        onClick={handleSalvarAlteracoes} 
                        disabled={isLoading}
                        className={styles.saveButton}
                    >
                        {isLoading ? 'Atualizando...' : 'Atualizar Rota'}
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

export default EditarRotaPage;