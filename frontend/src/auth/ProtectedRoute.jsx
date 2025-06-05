import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute() {
    const { isAuthenticated, isLoading: isLoadingAuth } = useAuth();
    const location = useLocation(); 

    if (isLoadingAuth && !localStorage.getItem('authToken')) { 
         return <div>Verificando autenticação...</div>; 
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <Outlet />;
}

export default ProtectedRoute;