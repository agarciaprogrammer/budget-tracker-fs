import styles from '../styles/welcomeCard.module.css';

export default function WelcomeCard() {
  return (
    <div className={styles.welcomeCard}>
      <h1 className={styles.title}>Bienvenido a tu Control de Gastos!</h1>
      <p className={styles.description}>
        Controla tus gastos, ingresos y gastos fijos de manera sencilla y visual. Lleva el registro de tus finanzas personales y toma mejores decisiones.
      </p>
      <h3 className={styles.stepsTitle}>Pasos para crear tu primer gasto:</h3>
      <ol className={styles.stepsList}>
        <li>Primero, crea una categoría en la sección <b>Categorías</b>.</li>
        <li>Ve a la sección <b>Gastos</b> desde el menú.</li>
        <li>Haz clic en <b>Agregar Gasto</b>.</li>
        <li>Completa el formulario con el monto, categoría y fecha.</li>
        <li>Guarda el gasto y ¡listo! Verás tu gasto reflejado en la lista y los gráficos.</li>
      </ol>
    </div>
  );
}
