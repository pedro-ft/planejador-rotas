import React from 'react';
import styles from './Modal.module.css';

function Modal({ isOpen, onClose, title, children, showFooter = true, showConfirmButton = false, confirmText = "Confirmar", onConfirm, cancelText = "Cancelar" }) {
    if (!isOpen) {
        return null;
    }

    const handleConfirm = () => {
        if (onConfirm) {
            onConfirm();
        }
        onClose();
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                {title && <h2 className={styles.modalTitle}>{title}</h2>}
                <div className={styles.modalBody}>
                    {children}
                </div>
                {showFooter && (
                <div className={styles.modalFooter}>
                    <button onClick={onClose} className={`${styles.modalButton} ${styles.cancelButton}`}>
                        {showConfirmButton ? cancelText : "OK"} 
                    </button>
                    {showConfirmButton && onConfirm && (
                        <button onClick={handleConfirm} className={`${styles.modalButton} ${styles.confirmButton}`}>
                            {confirmText}
                        </button>
                    )}
                </div>
                )}
            </div>
        </div>
    );
}

export default Modal;