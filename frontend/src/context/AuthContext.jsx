import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as apiLogin, registrar as apiRegister } from '../services/apiClient';
//import { setAuthToken as setApiClientAuthToken, clearAuthToken as clearApiClientAuthToken } from '../services/apiClient'; // Funções para configurar o token no apiClient

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem('authToken'));
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [authError, setAuthError] = useState(null);

    useEffect(() => {
        if (token) {
            localStorage.setItem('authToken', token);
            // Idealmente, aqui você decodificaria o token para pegar o 'username' e 'userId'
            // ou faria uma chamada para um endpoint '/api/auth/me' para buscar dados do usuário.
            // Por simplicidade agora, vamos assumir que o login retorna os dados do usuário
            // e que o token em si não é usado para popular 'user' diretamente aqui,
            // mas sim a função login/checkUser.
            // Se você armazenar o usuário no localStorage também, pode carregá-lo aqui.
            // Ex: const storedUser = localStorage.getItem('authUser');
            // if (storedUser) setUser(JSON.parse(storedUser));

            // TODO: Configurar o token no apiClient para chamadas autenticadas
            // Ex: setApiClientAuthToken(token); 
        } else {
            localStorage.removeItem('authToken');
            localStorage.removeItem('authUser');
            setUser(null);
            // Ex: clearApiClientAuthToken();
        }
    }, [token]);

    const login = async (username, password) => {
        setIsLoading(true);
        setAuthError(null);
        try {
            const response = await apiLogin(username, password);
            if (response.data && response.data.token && response.data.usuario) {
                setToken(response.data.token);
                setUser(response.data.usuario);
                localStorage.setItem('authUser', JSON.stringify(response.data.usuario));
                return true;
            } else {
                throw new Error(response.message || "Resposta de login inválida.");
            }
        } catch (error) {
            console.error("Erro no login (AuthContext):", error);
            setAuthError(error.message || "Falha no login. Verifique suas credenciais.");
            setToken(null);
            setUser(null);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (username, password) => {
        setIsLoading(true);
        setAuthError(null);
        try {
            const response = await apiRegister(username, password); // apiClient.js deve ter essa função
            // Após o registro, você pode optar por logar o usuário automaticamente ou pedir que ele faça login.
            // Por enquanto, vamos apenas retornar sucesso no registro.
            // Se quiser logar automaticamente, chame login(username, password) aqui.
            return { success: true, message: response.message };
        } catch (error) {
            console.error("Erro no registro (AuthContext):", error);
            setAuthError(error.message || "Falha no registro. Tente novamente.");
            return { success: false, message: error.message || "Falha no registro." };
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        setToken(null);
        // setUser(null); // Já é feito pelo useEffect quando token vira null
        // localStorage.removeItem('authToken'); // Já é feito pelo useEffect
        // localStorage.removeItem('authUser'); // Já é feito pelo useEffect
        // Idealmente, aqui também navegaria para a página de login.
        // Isso pode ser feito no componente que chama logout usando useNavigate.
    };

    const value = {
        token,
        user,
        setUser, 
        isLoading,
        authError,
        setAuthError, 
        login,
        register,
        logout,
        isAuthenticated: !!token 
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined && context === null) {
        throw new Error("useAuth deve ser usado dentro de um AuthProvider");
    }
    return context;
}