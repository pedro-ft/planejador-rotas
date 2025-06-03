import React from 'react'

function ItemDestino({ destino, aoDeletar }) {
    if (!destino || !destino._id) {
        console.warn("Objeto destino inválido ou sem _id:", destino);
        return null; 
    }

    return (
        <li style={{ 
                marginBottom: '10px', 
                padding: '10px', 
                border: '1px solid #eee', 
                borderRadius: '4px', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center' 
            }}
        >
            <span>{destino.nome || destino.cidade || 'Nome não disponível'} - {destino.endereco || destino.pais || '(sem endereço/país)'}</span>
            <button 
                onClick={() => aoDeletar(destino._id)} 
                style={{ 
                    padding: '5px 10px', 
                    backgroundColor: '#d9534f', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '4px', 
                    cursor: 'pointer' 
                }}
            >
                Excluir
            </button>
        </li>
    );
}

export default ItemDestino