import React, { useState } from 'react';

function AdicionarDestino({ aoAdicionar }) {
    const [nomeDestino, setNomeDestino] = useState('');
    const [paisDestino, setPaisDestino] = useState('');
    const [enderecoDestino, setEnderecoDestino] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!nomeDestino.trim() || !paisDestino.trim()) {
            alert("Por favor, informe o nome do destino.");
            return;
        }
        aoAdicionar({
            nome: nomeDestino,
            pais: paisDestino,
            endereco: enderecoDestino });
        setNomeDestino('');
        setPaisDestino('');
        setEnderecoDestino('');
    };

    return (
        <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h3>Adicionar Destino</h3>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="formInputNomeDestino" style={{ display: 'block', marginBottom: '5px' }}>Nome do Destino (Cidade)</label>
                    <input
                        type="text"
                        id="formInputNomeDestino"
                        value={nomeDestino}
                        onChange={(e) => setNomeDestino(e.target.value)}
                        placeholder="Ex: Ponto Turístico A, Cliente X"
                        style={{ width: 'calc(100% - 20px)', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                    />
                </div>
                                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="formInputPaisDestino" style={{ display: 'block', marginBottom: '5px' }}>País</label>
                    <input
                        type="text"
                        id="formInputPaisDestino"
                        value={paisDestino}
                        onChange={(e) => setPaisDestino(e.target.value)}
                        placeholder="Ex: Brasil, França"
                        style={{ width: 'calc(100% - 20px)', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="formInputEnderecoDestino" style={{ display: 'block', marginBottom: '5px' }}>Endereço ou Coordenadas</label>
                    <input
                        type="text"
                        id="formInputEnderecoDestino"
                        value={enderecoDestino}
                        onChange={(e) => setEnderecoDestino(e.target.value)}
                        placeholder="Ex: Rua Exemplo, 123 ou -23.5505, -46.6333"
                        style={{ width: 'calc(100% - 20px)', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                    />
                </div>
                <button type="submit" style={{ padding: '10px 15px', backgroundColor: '#5cb85c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    + Adicionar Destino à Rota
                </button>
            </form>
        </div>
    );
}

export default AdicionarDestino;