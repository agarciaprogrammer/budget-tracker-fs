import styles from '../styles/global.module.css'

export default function LoadingSpinner() {
    return (
        <div className={styles.spinnerContainer}>
            <div className={styles.loader}></div>
            <p className={styles.text}>Loading...</p>
        </div>
    );
}