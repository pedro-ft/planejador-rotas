import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import InputNome from '../components/Rotas/InputNome';
import AdicionarDestino from '../components/Rotas/AdicionarDestino';
import ListaDestinos from '../components/Rotas/ListaDestinos';
import ResumoRota from '../components/Rotas/ResumoRota';
// import apiClient from '../services/api'; // Supondo um futuro arquivo para chamadas API

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
            observacoes: dadosNovoDestino.endereco
        };

        try {
            const response = await fetch('http://localhost:4000/api/destinos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dadosParaApi),
            });

            if (!response.ok) {
                const erroData = await response.json();
                throw new Error(erroData.message || `Erro HTTP: ${response.status}`);
            }

            const destinoSalvo = await response.json();

            console.log("Destino salvo pela API:", destinoSalvo);
            setDestinosNaRota(destinosAnteriores => [...destinosAnteriores, destinoSalvo.data]);

        } catch (error) {
            console.error("Falha ao adicionar destino:", error);
            alert(`Erro ao adicionar destino: ${error.message}`);
        }
    };

    const handleDeletarDestino = async (idDoDestino) => {
        console.log("Deletar destino ID:", idDoDestino);
        
    if (!window.confirm("Tem certeza que deseja excluir este destino?")) {
        return;
    }

    try {
        const response = await fetch(`http://localhost:4000/api/destinos/${idDoDestino}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const erroData = await response.json();
            throw new Error(erroData.message || `Erro HTTP: ${response.status}`);
        }

        const resultadoApi = await response.json(); 
        console.log("Resposta da API ao deletar:", resultadoApi);

        if (resultadoApi.data && resultadoApi.data.numRemoved > 0) {
            setDestinosNaRota(destinosAnteriores => 
                destinosAnteriores.filter(destino => destino._id !== idDoDestino)
            );
            alert("Destino excluído com sucesso!");
        } else {
            console.warn("Nenhum destino foi removido pela API, ou resposta inesperada:", resultadoApi);
            alert("Destino não encontrado ou já havia sido removido.");
        }

    } catch (error) {
        console.error("Falha ao deletar destino:", error);
        alert(`Erro ao deletar destino: ${error.message}`);
    }

    };

    const handleMudarNomeRota = (novoNome) => {
        setNomeRota(novoNome);
    };
    
    const handleSalvarRota = async () => {
        if (!nomeRota.trim()) {
            alert("Por favor, dê um nome para a sua rota antes de salvar.");
            return;
        }
        if (destinosNaRota.length === 0) {
            alert("Adicione pelo menos um destino à rota antes de salvar.");
            return;
        }

        const dadosNovaRotaParaApi = {
            nome: nomeRota,
            destinos: destinosNaRota
        };

        console.log("Enviando para POST /api/rotas:", dadosNovaRotaParaApi);

        try {
            const response = await fetch('http://localhost:4000/api/rotas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dadosNovaRotaParaApi),
            });

            if (!response.ok) {
                const erroData = await response.json();
                throw new Error(erroData.message || `Erro HTTP ao salvar rota: ${response.status}`);
            }

            const rotaSalva = await response.json();
            console.log("Rota salva no backend:", rotaSalva.data);
            alert(`Rota "${rotaSalva.data.nome}" salva com sucesso no backend!`);

            setNomeRota('');
            setDestinosNaRota([]);

            navigate('/');
        } catch (error) {
            console.error("Falha ao salvar a rota no backend:", error);
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