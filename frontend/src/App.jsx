import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './App.css';
import NovaRota from './pages/NovaRota';
import ListarRotas from './pages/ListarRotas';
import EditarRotas from './pages/EditarRotas';
import Header from './components/Header/Header';

function App() {
    return (
        <div className="App">
            <Header />
            <main className="main">
                <Routes>
                    <Route path="/" element={<ListarRotas />} />
                    <Route path="/rotas" element={<ListarRotas />} />
                    <Route path="/rotas/nova" element={<NovaRota />} /> 
                    <Route path="/rotas/editar/:idRota" element={<EditarRotas />} />
                </Routes>
            </main>
        </div>
    );
}

export default App;