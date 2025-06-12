import { useEffect, useState } from 'react';
import styles from '../styles/global.module.css';
import { getExpenses, createExpense, deleteExpense } from '../services/expenseService';
import { getCategories } from '../services/categoryService';
import type { Category, Expense } from '../types';
import FormField from '../components/FormField';
import Modal from '../components/Modal';


export default function Expenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [loading, setLoading] = useState(false);
  

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const data = await getExpenses();
      setExpenses(data);
    } catch (err) {
      console.error('Error fetching expenses:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  useEffect(() => {
    fetchExpenses();
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !date || !categoryId) return;

    try {
      await createExpense({
        amount: parseFloat(amount),
        description,
        date,
        categoryId: parseInt(categoryId),
      });
      setAmount('');
      setDescription('');
      setDate('');
      setCategoryId('');
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

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Gastos</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
        <input
          type="number"
          className={styles.input}
          placeholder="Monto"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <input
          type="text"
          className={styles.input}
          placeholder="Descripción"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="date"
          className={styles.input}
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <select
          className={styles.input}
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          required
        >
          <option value="">Seleccionar categoría</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        <button type="submit" className={styles.button}>Agregar</button>
      </form>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div className={styles.card}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>Monto</th>
                <th>Descripción</th>
                <th>Fecha</th>
                <th>Categoría</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((exp) => (
                <tr key={exp.id}>
                  <td>${exp.amount.toFixed(2)}</td>
                  <td>{exp.description || '-'}</td>
                  <td>{new Date(exp.date).toLocaleDateString()}</td>
                  <td>
                    {categories.find((cat) => cat.id === exp.categoryId)?.name || 'Sin categoría'}
                  </td>
                  <td>
                    <button onClick={() => handleDelete(exp.id)} className={styles.button} style={{ backgroundColor: '#ff3b30' }}>
                      Eliminar
                    </button>
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
      )}
    </div>
  );
};
