import React, { useState, useId } from 'react'
import styles from './InputSenha.module.css'
import olhoAbertoIcon from '../assets/olho-aberto.svg'
import olhoFechadoIcon from '../assets/olho-fechado.svg'

function InputSenha({ label, value, onChange }) {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const inputId = useId();

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(prevState => !prevState);
    }

    return (
        <div className={styles.passwordInputContainer}>
            <label htmlFor={inputId} className={styles.label}>{label}</label>
            <div className={styles.inputWrapper}>
                <input
                    type={isPasswordVisible ? "text" : "password"}
                    id={inputId}
                    value={value}
                    onChange={onChange}
                    className={styles.inputField}
                    required
                />
                <button 
                    type="button"
                    className={styles.toggleButton}
                    onClick={togglePasswordVisibility}
                    title={isPasswordVisible ? "Ocultar senha" : "Mostrar senha"}
                >
                    <img 
                        src={isPasswordVisible ? olhoFechadoIcon : olhoAbertoIcon}
                        alt={isPasswordVisible ? "Ícone de olho fechado" : "Ícone de olho aberto"}
                        className={styles.toggleIcon}
                    />
                </button>
            </div>
        </div>
    );
}

export default InputSenha;