import React from 'react';

function InputNome({ valor, aoMudar }) {
    return (
        <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <label htmlFor="inputNomeRota" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Nome da Rota</label>
            <input
                type="text"
                id="inputNomeRota"
                value={valor}
                onChange={(e) => aoMudar(e.target.value)}
                placeholder="Ex: Viagem de Férias, Entregas da Manhã"
                style={{ width: 'calc(100% - 20px)', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
        </div>
    );
}

export default InputNome;