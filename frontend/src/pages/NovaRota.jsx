import React, { useState} from 'react';
import { useNavigate } from 'react-router-dom';
import InputNome from '../components/Rotas/InputNome';
import AdicionarDestino from '../components/Rotas/AdicionarDestino';
import ListaDestinos from '../components/Rotas/ListaDestinos';
import ResumoRota from '../components/Rotas/ResumoRota';
import { criarDestino as apiCriarDestino, deletarDestino as apiDeletarDestino, criarRota as apiCriarRota, obterCalculoDetalhesRota } from '../services/apiClient';

// import './NovaRota.module.css';

function NovaRota() {
    const navigate = useNavigate();
    const [nomeRota, setNomeRota] = useState('');
    const [destinosNaRota, setDestinosNaRota] = useState([]);

    const [previaDetalhes, setPreviaDetalhes] = useState(null);
    const [isLoadingPrevia, setIsLoadingPrevia] = useState(false);
    const [errorPrevia, setErrorPrevia] = useState(null);

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
            alert(`Erro ao adicionar destino: ${error.message}`);
        }
    };

    const handleDeletarDestino = async (idDoDestino) => {
        if (!window.confirm("Tem certeza que deseja excluir este destino da rota atual?")) return;
        try {
            await apiDeletarDestino(idDoDestino);
            setDestinosNaRota(destinosAnteriores => 
                destinosAnteriores.filter(destino => destino._id !== idDoDestino)
            );
            invalidarPrevia()
        } catch (error) {
            alert(`Erro ao deletar destino: ${error.message}`);
        }
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
        if (!nomeRota.trim() || destinosNaRota.length === 0) { return; }
        const dadosNovaRotaParaApi = {
            nome: nomeRota,
            destinos: destinosNaRota 
        };
        try {
            const respostaApi = await apiCriarRota(dadosNovaRotaParaApi); 
            alert(`Rota "${respostaApi.data.nome}" salva com sucesso no backend!`);
            setNomeRota('');
            setDestinosNaRota([]);
            navigate('/');
        } catch (error) {
            alert(`Erro ao salvar rota: ${error.message}`);
        }
    };

    const handleCalcularPrevia = async () => {
        if (destinosNaRota.length < 2) {
            alert("Adicione pelo menos dois destinos para calcular a prévia da rota.");
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

    return (
        <div className="pagina-nova-rota" style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
            <div style={{ marginBottom: '20px' }}>
                <button 
                    onClick={() => navigate('/')} 
                    style={{ background: 'none', border: 'none', color: '#0275d8', cursor: 'pointer', padding: '0', fontSize: '1em' }}
                >
                    &larr; Voltar para Lista
                </button>
            </div>
            <h2>Adicionar Nova Rota</h2>

            <InputNome valor={nomeRota} aoMudar={handleMudarNomeRota} />
            <AdicionarDestino aoAdicionar={handleAdicionarDestino} />
            <ListaDestinos destinos={destinosNaRota} aoDeletar={handleDeletarDestino}  aoMoverParaCima={handleMoverDestinoParaCima} aoMoverParaBaixo={handleMoverDestinoParaBaixo}/>
            <div /*className={styles.sectionCard}*/ style={{backgroundColor: '#434c5e', padding: '25px', borderRadius: '8px', marginBottom: '30px', border: '1px solid #4c566a'}}>
                <h3 /*className={styles.sectionTitle}*/ style={{fontSize: '1.3rem', color: '#eceff4', marginTop: '0', marginBottom: '20px', borderBottom: '1px solid #4c566a', paddingBottom: '10px'}}>
                    Resumo da Rota
                </h3>
                <ResumoRota 
                    detalhesCalculados={previaDetalhes}
                    isLoading={isLoadingPrevia}
                    error={errorPrevia}
                    numDestinosNaRotaAtual={destinosNaRota.length}
                />
                {destinosNaRota.length >= 2 && ( 
                    <button 
                        onClick={handleCalcularPrevia} 
                        disabled={isLoadingPrevia}
                        style={{ marginTop: '15px', padding: '10px 15px', backgroundColor: '#88c0d0', color: '#2e3440', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        {isLoadingPrevia ? 'Calculando Prévia...' : 'Calcular Prévia Detalhada'}
                    </button>
                )}
            </div>
            
            <div style={{ textAlign: 'right', marginTop: '30px' }}>
                <button onClick={handleSalvarRota} style={{ padding: '12px 25px', backgroundColor: '#0275d8', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' }}>
                    Salvar Rota
                </button>
            </div>
        </div>
    );
}

export default NovaRota;