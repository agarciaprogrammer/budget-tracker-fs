import styles from '../styles/global.module.css';

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export default function Modal({isOpen, onClose, title, children}: ModalProps) {
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <h2 className={styles.modalTitle}>{title}</h2>
                <button className={styles.closeButton} onClick={onClose}>X</button>
                <div className={styles.modalBody}>
                    {children}
                </div>
            </div>
        </div>
    )
}
