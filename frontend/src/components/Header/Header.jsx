import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Header.module.css';
import iconeRotas from '../../assets/rotasIcon.svg';
import iconeLista from '../../assets/listIcon.svg';
import iconeAdicionar from '../../assets/addIcon.svg';
import userIcon from '../../assets/userIcon.svg'
import logoutIcon from '../../assets/logoutIcon.svg'

function Header() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className={styles.appHeader}>
            <div className={styles.logoArea}>
                <img src={iconeRotas} alt="Ícone de Localização" className={`${styles.icon} ${styles.logoIcon}`}/>
                <Link to="/" className={styles.logoText}>Planejador de Rotas</Link>
            </div>
            <div className={styles.groupActions}>
                <div className={styles.navActions}>
                    <Link to="/" className={`${styles.buttonLink} ${styles.listarRotasBtn}`}>
                        <img src={iconeLista} alt="Ícone Lista" className={styles.icon} />
                        Listar Rotas
                    </Link>
                    <Link to="/rotas/nova" className={`${styles.buttonLink} ${styles.novaRotaBtn}`}>
                        <img src={iconeAdicionar} alt="Ícone Mais" className={styles.icon} />
                        Nova Rota
                    </Link>
                </div>
                <div className={styles.userInfo}>
                    <img src={userIcon} alt="Usuário" className={styles.userIcon} />
                    <span className={styles.buttonText}>{user? user.username : 'Carregando...' }</span>
                </div>
                    <button onClick={handleLogout} className={`${styles.buttonLink} ${styles.logoutButton}`} title="Sair">
                    <img src={logoutIcon} alt="Sair" className={styles.icon} />
                    <span className={styles.buttonText}>Sair</span>
                </button>
            </div>
        </header>
    );
}

export default Header;