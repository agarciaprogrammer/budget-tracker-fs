import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/global.module.css';
import { getExpenses, createExpense, deleteExpense, updateExpense } from '../services/expenseService';
import { getCategories } from '../services/categoryService';
import { getIncomes } from '../services/incomeService';
import { getCurrentUser } from '../services/authService';
import { getFixedExpensesByUserId } from '../services/fixedExpenseService';
import type { Category, Expense, FixedExpense, Income } from '../types';  
import Modal from '../components/Modal';
import FormField from '../components/FormField';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faFilter, faSortUp, faSortDown, faPlus } from '@fortawesome/free-solid-svg-icons';
import { formatMoney } from '../utils/formatMoney';
import { getLocalDateFromStr, isSameMonth, formatDateForDisplay } from '../utils/dateUtils';

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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [expenseToDelete, setExpenseToDelete] = useState<number | null>(null);
  const [filters, setFilters] = useState({
    categoryId: '',
    minAmount: '',
    maxAmount: '',
    sortBy: 'date',
    sortOrder: 'desc'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const currentUser = getCurrentUser();
  const navigate = useNavigate();

  const fetchExpenses = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const data = await getExpenses();
      // Filter expenses for current month using the new utility
      const filteredExpenses = data.filter(expense => {
        const expenseDate = getLocalDateFromStr(expense.date);
        return isSameMonth(expenseDate, currentMonth);
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

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setAmount(expense.amount.toString());
    setDescription(expense.description || '');
    setDate(expense.date);
    setCategoryId(expense.categoryId.toString());
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    setExpenseToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!expenseToDelete) return;
    try {
      await deleteExpense(expenseToDelete);
      setExpenses((prev) => prev.filter((e) => e.id !== expenseToDelete));
      setIsDeleteModalOpen(false);
      setExpenseToDelete(null);
    } catch (err) {
      console.error('Error deleting expense:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !date || !categoryId) return;

    try {
      if (editingExpense) {
        await updateExpense(editingExpense.id, {
          amount: parseFloat(amount),
          description,
          date,
          categoryId: parseInt(categoryId),
          userId: currentUser?.id || 0,
        });
      } else {
        await createExpense({
          amount: parseFloat(amount),
          description,
          date,
          categoryId: parseInt(categoryId),
          userId: currentUser?.id || 0,
        });
      }
      setAmount('');
      setDescription('');
      setDate('');
      setCategoryId('');
      setEditingExpense(null);
      setIsModalOpen(false);
      fetchExpenses();
    } catch (err) {
      console.error('Error saving expense:', err);
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
    
    // Calculate total income for current month using the new utility
    const totalIncome = incomes
      .filter(income => {
        const incomeDate = getLocalDateFromStr(income.date);
        return isSameMonth(incomeDate, currentMonth);
      })
      .reduce((sum, income) => sum + income.amount, 0);

    // Calculate salary for current month using the new utility
    const totalSalary = incomes
      .filter(income => {
        const incomeDate = getLocalDateFromStr(income.date);
        return income.type === 'salary' && isSameMonth(incomeDate, currentMonth);
      })
      .reduce((sum, income) => sum + income.amount, 0);

    // Calculate total fixed expenses for current month using the new utility
    const totalFixedExpenses = fixedExpenses
      .filter(fixedExpense => {
        const fixedExpenseDate = getLocalDateFromStr(fixedExpense.startDate);
        return isSameMonth(fixedExpenseDate, currentMonth) && fixedExpense.isActive;
      })
      .reduce((sum, fixedExpense) => sum + fixedExpense.amount, 0);
    
    // Calculate remaining budget
    const remainingBudget = totalIncome - totalExpenses - totalFixedExpenses;

    // Calculate days in month
    //const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const lastDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    
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

  const applyFilters = (expenses: Expense[]) => {
    let filtered = [...expenses];

    // Apply category filter
    if (filters.categoryId) {
      filtered = filtered.filter(exp => exp.categoryId.toString() === filters.categoryId);
    }

    // Apply amount range filter
    if (filters.minAmount) {
      filtered = filtered.filter(exp => exp.amount >= parseFloat(filters.minAmount));
    }
    if (filters.maxAmount) {
      filtered = filtered.filter(exp => exp.amount <= parseFloat(filters.maxAmount));
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (filters.sortBy) {
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case 'amount':
          comparison = a.amount - b.amount;
          break;
        case 'category':
          const categoryA = categories.find(cat => cat.id === a.categoryId)?.name || '';
          const categoryB = categories.find(cat => cat.id === b.categoryId)?.name || '';
          comparison = categoryA.localeCompare(categoryB);
          break;
      }
      return filters.sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  };

  const filteredExpenses = applyFilters(expenses);
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentExpenses = filteredExpenses.slice(startIndex, endIndex);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Gastos</h1>
        <div className={styles.headerActions}>
          
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
      </div>

      {isFiltersOpen && (
        <div className={styles.filtersPanel}>
          <h3>Filtros</h3>
          <FormField
            label="Categoría: "
            name="categoryFilter"
            type="select"
            value={filters.categoryId}
            onChange={(e) => setFilters(prev => ({ ...prev, categoryId: e.target.value }))}
            options={categories.map(cat => ({
              value: cat.id.toString(),
              label: cat.name
            }))}
          />
          <FormField
            label="Monto Mínimo: "
            name="minAmount"
            type="number"
            value={filters.minAmount}
            onChange={(e) => setFilters(prev => ({ ...prev, minAmount: e.target.value }))}
          />
          <FormField
            label="Monto Máximo: "
            name="maxAmount"
            type="number"
            value={filters.maxAmount}
            onChange={(e) => setFilters(prev => ({ ...prev, maxAmount: e.target.value }))}
          />
          <label>Ordenar por:</label>
          <div className={styles.sortControls}>
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
              className={styles.selectFormField}
            >
              <option value="date">Fecha</option>
              <option value="amount">Monto</option>
              <option value="category">Categoría</option>
            </select>
            <button
              onClick={() => setFilters(prev => ({ 
                ...prev, 
                sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc' 
              }))}
              className={styles.sortButton}
            >
              <FontAwesomeIcon icon={filters.sortOrder === 'asc' ? faSortUp : faSortDown} />
            </button>
          </div>
        </div>
      )}

      <button 
        className={styles.addButton} 
        style={{ marginBottom: '-10px' }}
        onClick={() => {
          setEditingExpense(null);
          setAmount('');
          setDescription('');
          setDate('');
          setCategoryId('');
          setIsModalOpen(true);
        }}
      >
        Agregar Gasto
      </button>

      <div className={styles.summary}>
        <div className={styles.summaryItem}>
          <h3>Presupuesto del Mes</h3>
          <p>${formatMoney(totals.totalIncome - totals.totalFixedExpenses)}</p>
        </div>
        <div className={styles.summaryItem}>
          <h3>Presupuesto por Día</h3>
          <p>${formatMoney(totals.budgetPerDay)}</p>
        </div>
      </div>
      <br />

      <button 
            className={styles.filterButton}
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          >
            <FontAwesomeIcon icon={faFilter} /> Filtros
      </button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingExpense(null);
        }}
        title={editingExpense ? "Editar Gasto" : "Nuevo Gasto"}
      >
        <form onSubmit={handleSubmit} className={styles.form}>
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
          <div className={styles.categoryFieldRow}>
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
            <button
              type="button"
              className={styles.iconButton}
              title="Agregar nueva categoría"
              onClick={() => navigate('/category')}
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>
          </div>
          <button type="submit" className={styles.buttonFormField}>
            {editingExpense ? "Guardar" : "Agregar"}
          </button>
        </form>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setExpenseToDelete(null);
        }}
        title="Confirmar Eliminación"
      >
        <div className={styles.deleteConfirmation}>
          <p>¿Estás seguro que deseas eliminar este gasto?</p>
          <div className={styles.deleteActions}>
            <button 
              onClick={() => {
                setIsDeleteModalOpen(false);
                setExpenseToDelete(null);
              }}
              className={styles.buttonCancel}
            >
              Cancelar
            </button>
            <button 
              onClick={confirmDelete}
              className={styles.buttonDelete}
            >
              Eliminar
            </button>
          </div>
        </div>
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
                  {currentExpenses.map((exp) => (
                    <tr key={exp.id}>
                      <td>{exp.description || '-'}</td>
                      <td>${formatMoney(exp.amount)}</td>
                      <td>{formatDateForDisplay(exp.date)}</td>
                      <td>
                        {categories.find((cat) => cat.id === exp.categoryId)?.name || 'Sin categoría'}
                      </td>
                      <td>
                        <div className={styles.actions}>
                          <button
                            onClick={() => handleEdit(exp)}
                            className={styles.buttonEdit}
                          >
                            Editar
                          </button>
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
                  {currentExpenses.length === 0 && (
                    <tr>
                      <td colSpan={5}>Sin gastos registrados.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className={styles.pagination}>
            <button
              className={styles.paginationButton}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <span className={styles.pageInfo}>
              Página {currentPage} de {totalPages}
            </span>
            <button
              className={styles.paginationButton}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>

          <div className={styles.summary}>
            <div className={styles.summaryItem}>
              <h3>Gastos del Mes</h3>
              <p>${formatMoney(totals.totalExpenses)}</p>
            </div>
            <div className={styles.summaryItem}>
              <h3>Presupuesto Restante</h3>
              <p className={totals.remainingBudget < 0 ? styles.negative : styles.positive}>
                ${formatMoney(totals.remainingBudget)}
              </p>
            </div>
            <div className={styles.summaryItem}>
              <h3>Presupuesto Vs Sueldo</h3>
              <p className={totals.remainingBudget < 0 ? styles.negative : styles.positive}>
                ${formatMoney(totals.totalSalary - totals.totalExpenses)}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
