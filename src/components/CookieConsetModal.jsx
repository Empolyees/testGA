import React from "react";
import styles from "./CookieConsentModal.module.css";

const CookieConsentModal = ({ onConsent }) => {
    // Funkce pro zavření modalu se zamítnutím souhlasu
    const handleClose = () => {
        onConsent("denied"); // Nastaví odmítnutí při zavření modalu
    };

    return (
        <div className={styles.modalOverlay} onClick={handleClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeButton} onClick={handleClose}>✖</button>
                <h2>🍪 Nastavení soukromí</h2>
                <p>Souhlasíte s použitím cookies pro lepší uživatelský zážitek?</p>
                <div className={styles.modalButtons}>
                    <button className={styles.accept} onClick={() => onConsent("granted")}>Souhlasím</button>
                    <button className={styles.reject} onClick={handleClose}>Odmítnout</button>
                </div>
            </div>
        </div>
    );
};

export default CookieConsentModal;

