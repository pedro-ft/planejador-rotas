import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './LoginRegister.module.css';

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();
    const auth = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!username || !password || !confirmPassword) {
            auth.setAuthError("Todos os campos são obrigatórios.");
            return;
        }
        if (password !== confirmPassword) {
            auth.setAuthError("As senhas não coincidem.");
            return;
        }
        // A validação de complexidade da senha (mínimo 6 chars, letras e números)
        // já está no backend, mas você poderia adicionar aqui também para feedback imediato.

        const result = await auth.register(username, password);
        if (result.success) {
            // alert(result.message); // Ou usar um modal
            // Idealmente, redirecionar para login ou logar automaticamente
            navigate('/login', { state: { message: "Registro bem-sucedido! Por favor, faça o login." } });
        } else {
            // O auth.authError já deve ter sido setado dentro de auth.register()
        }
    };

    return (
            <div className={styles.authPageContainer}>
            <h2 className={styles.title}>Criar Conta</h2>
            <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label htmlFor="username" className={styles.label}>Usuário</label>
                    <input 
                        type="text" id="username" value={username} 
                        onChange={(e) => setUsername(e.target.value)} required 
                        className={styles.inputField}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="password" className={styles.label}>Senha</label>
                    <input 
                        type="password" id="password" value={password} 
                        onChange={(e) => setPassword(e.target.value)} required 
                        className={styles.inputField}
                    />
                </div>
                <div className={styles.formGroup}> {/* Era marginBottom: 20px, agora controlado por formGroup */}
                    <label htmlFor="confirmPassword" className={styles.label}>Confirmar Senha</label>
                    <input 
                        type="password" id="confirmPassword" value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)} required 
                        className={styles.inputField}
                    />
                </div>

                {auth.authError && (
                    <p className={styles.errorMessage}>{auth.authError}</p>
                )}
                <button 
                    type="submit" 
                    disabled={auth.isLoading}
                    className={`${styles.submitButton} ${styles.registerButton}`} // Adiciona classe específica de cor
                >
                    {auth.isLoading ? 'Registrando...' : 'Registrar'}
                </button>
            </form>
            <p className={styles.switchFormLinkContainer}>
                Já tem uma conta?{' '}
                <Link to="/login" className={styles.switchFormLink}>
                    Faça login
                </Link>
            </p>
        </div>
    );
}

export default Register;