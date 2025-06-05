import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.css';
import iconeRotas from '../../assets/rotasIcon.svg';
import iconeLista from '../../assets/listIcon.svg';
import iconeAdicionar from '../../assets/addIcon.svg';
import userIcon from '../../assets/userIcon.svg'

function Header() {
    const nomeUsuario = "pedrotaborda";

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
                    {nomeUsuario}
                </div>
            </div>
        </header>
    );
}

export default Header;