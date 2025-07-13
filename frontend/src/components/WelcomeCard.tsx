import styles from '../styles/welcomeCard.module.css';

export default function WelcomeCard() {
  return (
    <div className={styles.welcomeCard}>
      <h1 className={styles.title}>Welcome to Budget Tracker!</h1>
      <p className={styles.description}>
        Easily track your expenses, incomes, and fixed costs with a simple and visual tool. Keep a record of your personal finances and make better decisions.
      </p>
      <h3 className={styles.stepsTitle}>Steps to create your first expense:</h3>
      <ol className={styles.stepsList}>
        <li>First, create a category in the <b>Categories</b> section.</li>
        <li>Go to the <b>Expenses</b> section from the menu.</li>
        <li>Click on <b>Add Expense</b>.</li>
        <li>Fill in the form with the amount, category, and date.</li>
        <li>Save the expense and done! You'll see it appear in the list and charts.</li>
      </ol>
    </div>
  );
}
