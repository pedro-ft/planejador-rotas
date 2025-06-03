import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './App.css';
import NovaRota from './pages/NovaRota';
import ListarRotas from './pages/ListarRotas';

function App() {
    return (
        <div className="App">
            <main style={{padding: '0 20px'}}>
                <Routes>
                    <Route path="/" element={<ListarRotas />} />
                    <Route path="/rotas" element={<ListarRotas />} />
                    <Route path="/rotas/nova" element={<NovaRota />} /> 
                </Routes>
            </main>
        </div>
    );
}

export default App;