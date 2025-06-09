import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import InputSenha from '../components/InputSenha';
import styles from './LoginRegister.module.css';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const auth = useAuth(); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!username || !password) {
            auth.setAuthError("Nome de usuário e senha são obrigatórios."); 
            return;
        }

        const success = await auth.login(username, password);
        if (success) {
            navigate('/');
        }
    };

    return (
        <div className={styles.authPageContainer}>
            <h2 className={styles.title}>Planejador de Rotas</h2>
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
                    <InputSenha
                        label="Senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                {auth.authError && (
                    <p className={styles.errorMessage}>{auth.authError}</p>
                )}
                <button 
                    type="submit" 
                    disabled={auth.isLoading}
                    className={`${styles.submitButton} ${styles.loginButton}`}
                >
                    {auth.isLoading ? 'Entrando...' : 'Entrar'}
                </button>
            </form>
            <p className={styles.switchFormLinkContainer}>
                Ainda não tem uma conta?{' '}
                <Link to="/registrar" className={styles.switchFormLink}>
                    Registre-se aqui
                </Link>
            </p>
        </div>
    );
}

export default Login;