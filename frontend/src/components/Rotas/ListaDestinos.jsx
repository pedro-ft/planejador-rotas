import React from 'react'
import ItemDestino from './ItemDestino'

function ListaDestinos({ destinos, aoDeletar }) {
    return (
        <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h3>Destinos da Rota ({destinos.length})</h3>
            {destinos.length === 0 ? (
                <p>Nenhum destino adicionado ainda.</p>
            ) : (
                <ul>
                    {destinos.map(destino => (
                        <ItemDestino 
                            key={destino._id} 
                            destino={destino} 
                            aoDeletar={aoDeletar} 
                        />
                    ))}
                </ul>
            )}
        </div>
    );
}

export default ListaDestinos