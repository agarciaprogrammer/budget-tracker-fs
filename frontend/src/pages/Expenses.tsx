import { useEffect, useState } from 'react';
import styles from '../styles/global.module.css';
import { getExpenses, createExpense, deleteExpense } from '../services/expenseService';
import { getCategories } from '../services/categoryService';
import { getIncomes } from '../services/incomeService';
import { getCurrentUser } from '../services/authService';
import { getFixedExpensesByUserId } from '../services/fixedExpenseService';
import type { Category, Expense, FixedExpense, Income } from '../types';  
import Modal from '../components/Modal';
import FormField from '../components/FormField';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

export default function Expenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [fixedExpenses, setFixedExpenses] = useState<FixedExpense[]>([]);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const currentUser = getCurrentUser();

  const fetchExpenses = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const data = await getExpenses();
      // Filter expenses for current month
      const filteredExpenses = data.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getMonth() === currentMonth.getMonth() &&
               expenseDate.getFullYear() === currentMonth.getFullYear();
      });
      setExpenses(filteredExpenses);
    } catch (err) {
      console.error('Error fetching expenses:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchIncomes = async () => {
    if (!currentUser) return;
    try {
      const data = await getIncomes();
      setIncomes(data);
    } catch (err) {
      console.error('Error fetching incomes:', err);
    }
  };

  const fetchCategories = async () => {
    if (!currentUser) return;
    try {
      const data = await getCategories();
      const userCategories = data.filter(category => category.userId === currentUser.id);
      setCategories(userCategories);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchFixedExpenses = async () => {
    if (!currentUser) return;
    try {
      const data = await getFixedExpensesByUserId(currentUser.id);
      setFixedExpenses(data);
    } catch (err) {
      console.error('Error fetching fixed expenses:', err);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchExpenses();
      fetchCategories();
      fetchIncomes();
      fetchFixedExpenses();
    }
  }, [currentMonth]); // Refetch when month changes

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !date || !categoryId) return;

    try {
      await createExpense({
        amount: parseFloat(amount),
        description,
        date,
        categoryId: parseInt(categoryId),
        userId: currentUser?.id || 0,
      });
      setAmount('');
      setDescription('');
      setDate('');
      setCategoryId('');
      setIsModalOpen(false);
      fetchExpenses();
    } catch (err) {
      console.error('Error creating expense:', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar gasto?')) return;
    try {
      await deleteExpense(id);
      setExpenses((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      console.error('Error deleting expense:', err);
    }
  };

  const changeMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentMonth);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentMonth(newDate);
  };

  const getMonthName = (date: Date) => {
    return date.toLocaleString('es-AR', { month: 'long', year: 'numeric' });
  };

  const calculateTotals = () => {
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    
    // Calculate total income for current month
    const totalIncome = incomes
      .filter(income => {
        const incomeDate = new Date(income.date);
        return incomeDate.getMonth() === currentMonth.getMonth() &&
               incomeDate.getFullYear() === currentMonth.getFullYear();
      })
      .reduce((sum, income) => sum + income.amount, 0);

    // Calculate salary for current month
    const totalSalary = incomes
      .filter(income => {
        const incomeDate = new Date(income.date);
        return income.type === 'salary' &&
               incomeDate.getMonth() === currentMonth.getMonth() &&
               incomeDate.getFullYear() === currentMonth.getFullYear();
      })
      .reduce((sum, income) => sum + income.amount, 0);

    // Calculate total fixed expenses for current month
    const totalFixedExpenses = fixedExpenses
      .filter(fixedExpense => {
        const fixedExpenseDate = new Date(fixedExpense.date);
        return fixedExpenseDate.getMonth() === currentMonth.getMonth() &&
               fixedExpenseDate.getFullYear() === currentMonth.getFullYear();
      })
      .reduce((sum, fixedExpense) => sum + fixedExpense.amount, 0);
    
    // Calculate remaining budget
    const remainingBudget = totalIncome - totalExpenses - totalFixedExpenses;

    // Calculate days in month using DAYS360 equivalent
    const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const lastDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    
    // DAYS360 equivalent calculation
    const daysInMonth = Math.floor((lastDayOfMonth.getTime() - firstDayOfMonth.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    // Calculate budget per day
    const budgetPerDay = totalIncome / daysInMonth;

    return {
      totalExpenses,
      totalIncome,
      totalSalary,
      totalFixedExpenses,
      remainingBudget,
      budgetPerDay,
    };
  };

  const totals = calculateTotals();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Gastos</h1>
        <div className={styles.monthNavigation}>
          <button 
            className={styles.monthButton}
            onClick={() => changeMonth('prev')}
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <span className={styles.currentMonth}>
            {getMonthName(currentMonth)}
          </span>
          <button 
            className={styles.monthButton}
            onClick={() => changeMonth('next')}
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      </div>

      <button 
        className={styles.addButton} style={{ marginBottom: '-10px' }}
        onClick={() => setIsModalOpen(true)}
      >
        Agregar Gasto
      </button>

      <div className={styles.summary}>
        <div className={styles.summaryItem}>
          <h3>Presupuesto del Mes</h3>
          <p>${(totals.totalIncome - totals.totalFixedExpenses).toFixed(2)}</p>
        </div>
        <div className={styles.summaryItem}>
          <h3>Presupuesto por Día</h3>
          <p>${totals.budgetPerDay.toFixed(2)}</p>
        </div>
      </div>
      <br />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nuevo Gasto"
      >
        <form onSubmit={handleSubmit} className={styles.form} >
          <FormField
            label="Descripción: "
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <FormField
            label="Monto: "
            name="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
          <FormField
            label="Fecha: "
            name="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <FormField
            label="Categoría: "
            name="category"
            type="select"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            options={categories.map(cat => ({
              value: cat.id.toString(),
              label: cat.name
            }))}
            required
          />
          <button type="submit" className={styles.buttonFormField}>
            Agregar
          </button>
        </form>
      </Modal>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <>
          <div className={styles.card}>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Descripción</th>
                    <th>Monto</th>
                    <th>Fecha</th>
                    <th>Categoría</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((exp) => (
                    <tr key={exp.id}>
                      <td>{exp.description || '-'}</td>
                      <td>${exp.amount.toFixed(2)}</td>
                      <td>
                        {new Date(exp.date).toLocaleDateString('es-AR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })}
                      </td>
                      <td>
                        {categories.find((cat) => cat.id === exp.categoryId)?.name || 'Sin categoría'}
                      </td>
                      <td>
                        <div className={styles.actions}>
                          <button
                            onClick={() => handleDelete(exp.id)}
                            className={styles.buttonDelete}
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {expenses.length === 0 && (
                    <tr>
                      <td colSpan={5}>Sin gastos registrados.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className={styles.summary}>
            <div className={styles.summaryItem}>
              <h3>Gastos del Mes</h3>
              <p>${totals.totalExpenses.toFixed(2)}</p>
            </div>
            <div className={styles.summaryItem}>
              <h3>Presupuesto Restante</h3>
              <p className={totals.remainingBudget < 0 ? styles.negative : styles.positive}>
                ${totals.remainingBudget.toFixed(2)}
              </p>
            </div>
            <div className={styles.summaryItem}>
              <h3>Presupuesto Vs Sueldo</h3>
              <p className={totals.remainingBudget < 0 ? styles.negative : styles.positive}>
                ${(totals.totalSalary - totals.totalExpenses).toFixed(2)}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
