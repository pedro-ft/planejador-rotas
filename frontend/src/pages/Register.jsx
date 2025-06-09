import React, { useState} from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './LoginRegister.module.css';
import InputSenha from '../components/InputSenha';

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

        const result = await auth.register(username, password);
        if (result.success) {
            navigate('/', { state: { message: "Registro bem-sucedido" } });
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
                    <InputSenha
                        label="Senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className={styles.formGroup}>
                    <InputSenha
                        label="Confirmar Senha"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>

                {auth.authError && (
                    <p className={styles.errorMessage}>{auth.authError}</p>
                )}
                <button 
                    type="submit" 
                    disabled={auth.isLoading}
                    className={`${styles.submitButton} ${styles.registerButton}`}
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