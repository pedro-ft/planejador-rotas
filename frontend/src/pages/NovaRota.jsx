import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import InputNome from '../components/Rotas/InputNome';
import AdicionarDestino from '../components/Rotas/AdicionarDestino';
import ListaDestinos from '../components/Rotas/ListaDestinos';
import ResumoRota from '../components/Rotas/ResumoRota';
import { criarDestino as apiCriarDestino, deletarDestino as apiDeletarDestino, criarRota as apiCriarRota } from '../services/apiClient';

// import './NovaRota.module.css';

function NovaRota() {
    const navigate = useNavigate();
    const [nomeRota, setNomeRota] = useState('');
    const [destinosNaRota, setDestinosNaRota] = useState([]);

    const handleAdicionarDestino = async (dadosNovoDestino) => {
        console.log("Dados recebidos no formulário:", dadosNovoDestino);

        const dadosParaApi = {
            cidade: dadosNovoDestino.nome,
            pais: dadosNovoDestino.pais,
            observacoes: dadosNovoDestino.endereco,
            nomeDaRotaPertecente: nomeRota
        };

        try {
            const respostaApi = await apiCriarDestino(dadosParaApi);
            setDestinosNaRota(destinosAnteriores => [...destinosAnteriores, respostaApi.data]);
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
        } catch (error) {
            alert(`Erro ao deletar destino: ${error.message}`);
        }
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
            const respostaApi = await apiCriarRota(dadosNovaRotaParaApi); // <<< Usar apiClient
            alert(`Rota "${respostaApi.data.nome}" salva com sucesso no backend!`);
            setNomeRota('');
            setDestinosNaRota([]);
            navigate('/');
        } catch (error) {
            alert(`Erro ao salvar rota: ${error.message}`);
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
            <ListaDestinos destinos={destinosNaRota} aoDeletar={handleDeletarDestino} />
            <ResumoRota destinos={destinosNaRota} />
            
            <div style={{ textAlign: 'right', marginTop: '30px' }}>
                <button onClick={handleSalvarRota} style={{ padding: '12px 25px', backgroundColor: '#0275d8', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' }}>
                    Salvar Rota
                </button>
            </div>
        </div>
    );
}

export default NovaRota;