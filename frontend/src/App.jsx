import React from 'react';
import { Routes, Route} from 'react-router-dom';
import './App.css';
import Header from './components/Header/Header';
import ProtectedRoute from './auth/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import NovaRota from './pages/NovaRota';
import ListarRotas from './pages/ListarRotas';
import EditarRotas from './pages/EditarRotas';
import NotFound from './pages/NotFound';
import Login from './pages/Login';        
import Register from './pages/Register';


function App() {
    const { isAuthenticated } = useAuth()
    return (
        <div className="App">
            {isAuthenticated && <Header />} 
            <main className="main">
                <Routes>
                    <Route element={<ProtectedRoute />}>
                        <Route path="/" element={<ListarRotas />} />
                        <Route path="/rotas" element={<ListarRotas />} />
                        <Route path="/rotas/nova" element={<NovaRota />} /> 
                        <Route path="/rotas/editar/:idRota" element={<EditarRotas />} />
                    </Route>
                    <Route path="/login" element={<Login />} />
                    <Route path="/registrar" element={<Register />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </main>
        </div>
    );
}

export default App;