import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2>Página Não Encontrada</h2>
            <p>A página que você está procurando não existe.</p>
            <Link to="/">Voltar para a Página Inicial</Link>
        </div>
    );
}
export default NotFound;