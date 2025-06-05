import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as apiLogin, registrar as apiRegister } from '../services/apiClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem('authToken'));
    const [isLoading, setIsLoading] = useState(false);
    const [authError, setAuthError] = useState(null);

    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('authUser');
        if (storedUser) {
            try {
                return JSON.parse(storedUser);
            } catch (e) {
                console.error("Erro ao parsear usuário do localStorage ao iniciar:", e);
                localStorage.removeItem('authUser');
                return null;
            }
        }
        return null;
    });


    useEffect(() => {
        if (token) {
            localStorage.setItem('authToken', token);
        } else {
            localStorage.removeItem('authToken');
            localStorage.removeItem('authUser');
            setUser(null);
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
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (username, password) => {
        setIsLoading(true);
        setAuthError(null);
        try {
            const registerResponse = await apiRegister(username, password); 
            const loginSuccess = await login(username, password); 

            if (loginSuccess) {
                return { 
                    success: true, 
                    loggedIn: true, 
                    message: registerResponse.message || "Usuário registrado e logado com sucesso." 
                };
            } else {
                return { 
                    success: true, 
                    loggedIn: false, 
                    message: "Usuário registrado com sucesso, mas o login automático falhou. Por favor, tente fazer login manualmente." 
                };
        }

    } catch (error) { 
        console.error("Erro no processo de registro (AuthContext):", error);
        if (!authError) { 
             setAuthError(error.message || "Falha no registro. Tente novamente.");
        }
        return { success: false, loggedIn: false, message: error.message || "Falha no registro." };
    } finally {
        setIsLoading(false);
    }
    };

    const logout = () => {
        setToken(null);
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
    if (!context) { 
        throw new Error("useAuth deve ser usado dentro de um AuthProvider");
    }
    return context;
}