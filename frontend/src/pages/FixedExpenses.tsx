import { useState, useEffect } from 'react';
import styles from '../styles/global.module.css';
import { getFixedExpenses, createFixedExpense, deleteFixedExpense, updateFixedExpense } from '../services/fixedExpenseService';
import { getCurrentUser } from '../services/authService';
import type { FixedExpense } from '../types';
import Modal from '../components/Modal';
import FormField from '../components/FormField';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faToggleOn, faToggleOff } from '@fortawesome/free-solid-svg-icons';
import { formatMoney } from '../utils/formatMoney';
import { formatDateForDisplay } from '../utils/dateUtils';

export default function FixedExpenses() {
    const [fixedExpenses, setFixedExpenses] = useState<FixedExpense[]>([]);
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingExpense, setEditingExpense] = useState<FixedExpense | null>(null);
    const [showInactive, setShowInactive] = useState(false);
    const currentUser = getCurrentUser();

    const fetchFixedExpenses = async () => {
        if (!currentUser) return;
        setLoading(true);
        try {
            const data = await getFixedExpenses();
            setFixedExpenses(data);
        } catch (err) {
            console.error('Error fetching fixed expenses:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (currentUser) {
            fetchFixedExpenses();
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || !description || !startDate) return;
        try {
            if (!currentUser) return;
            if (editingExpense) {
                await updateFixedExpense(editingExpense.id, { 
                    amount: Number(amount), 
                    description, 
                    startDate,
                    lastPaymentDate: editingExpense.lastPaymentDate,
                    nextPaymentDate: editingExpense.nextPaymentDate,
                    isActive: editingExpense.isActive,
                    userId: currentUser.id 
                });
            } else {
                const today = new Date();
                const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
                
                await createFixedExpense({ 
                    amount: Number(amount), 
                    description, 
                    startDate,
                    lastPaymentDate: null,
                    nextPaymentDate: nextMonth.toISOString().split('T')[0],
                    isActive: true,
                    userId: currentUser.id 
                });
            }
            setAmount('');
            setDescription('');
            setStartDate(new Date().toISOString().split('T')[0]);
            setEditingExpense(null);
            setIsModalOpen(false);
            fetchFixedExpenses();
        } catch (err) {
            console.error('Error creating/updating fixed expense:', err);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('¿Eliminar gasto fijo?')) return;
        try {
            await deleteFixedExpense(id);
            setFixedExpenses((prev) => prev.filter((e) => e.id !== id));
        } catch (err) {
            console.error('Error deleting fixed expense:', err);
        }
    };

    const handleEdit = (expense: FixedExpense) => {
        setEditingExpense(expense);
        setAmount(expense.amount.toString());
        setDescription(expense.description);
        setStartDate(expense.startDate);
        setIsModalOpen(true);
    };

    const toggleActive = async (expense: FixedExpense) => {
        try {
            await updateFixedExpense(expense.id, {
                ...expense,
                isActive: !expense.isActive,
                lastPaymentDate: !expense.isActive ? new Date().toISOString().split('T')[0] : expense.lastPaymentDate,
                nextPaymentDate: !expense.isActive ? 
                    new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString().split('T')[0] : 
                    expense.nextPaymentDate
            });
            fetchFixedExpenses();
        } catch (err) {
            console.error('Error toggling fixed expense:', err);
        }
    };

    const getNextPaymentDate = (expense: FixedExpense) => {
        if (!expense.isActive) return 'Inactive';
        if (!expense.nextPaymentDate) return 'Pending';
        return formatDateForDisplay(expense.nextPaymentDate);
    };

    const getLastPaymentDate = (expense: FixedExpense) => {
        if (!expense.lastPaymentDate) return 'Never';
        return formatDateForDisplay(expense.lastPaymentDate);
    };

    const filteredExpenses = showInactive 
        ? fixedExpenses 
        : fixedExpenses.filter(expense => expense.isActive);
    
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Fixed Expenses</h1>
                <div className={styles.headerActions}>
                    <button
                        className={styles.filterButton}
                        onClick={() => setShowInactive(!showInactive)}
                    >
                        {showInactive ? 'Show Active' : 'Show Inactive'}
                    </button>
                </div>
            </div>

            <button 
                onClick={() => {
                    setEditingExpense(null);
                    setAmount('');
                    setDescription('');
                    setStartDate(new Date().toISOString().split('T')[0]);
                    setIsModalOpen(true);
                }} 
                className={styles.addButton}
            >
                Add Fixed Expense
            </button>

            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingExpense(null);
                }}
                title={editingExpense ? "Edit Fixed Expense" : "New Fixed Expense"}
            >
                <form onSubmit={handleSubmit} className={styles.form}>
                    <FormField
                        label="Description: "
                        name="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                    <FormField
                        label="Amount: "
                        name="amount"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                    />
                    <FormField
                        label="Start date: "
                        name="startDate"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                    />
                    {editingExpense && (
                        <>
                            <FormField
                                label="Last Payment: "
                                name="lastPaymentDate"
                                type="date"
                                value={editingExpense.lastPaymentDate || ''}
                                onChange={(e) => {
                                    if (editingExpense) {
                                        setEditingExpense({
                                            ...editingExpense,
                                            lastPaymentDate: e.target.value
                                        });
                                    }
                                }}
                            />
                            <FormField
                                label="Next Payment: "
                                name="nextPaymentDate"
                                type="date"
                                value={editingExpense.nextPaymentDate || ''}
                                onChange={(e) => {
                                    if (editingExpense) {
                                        setEditingExpense({
                                            ...editingExpense,
                                            nextPaymentDate: e.target.value
                                        });
                                    }
                                }}
                            />
                            <div className={styles.formField}>
                                <label>State:</label>
                                <div className={styles.toggleContainer}>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (editingExpense) {
                                                setEditingExpense({
                                                    ...editingExpense,
                                                    isActive: !editingExpense.isActive
                                                });
                                            }
                                        }}
                                        className={styles.toggleButton}
                                    >
                                        <FontAwesomeIcon 
                                            icon={editingExpense?.isActive ? faToggleOn : faToggleOff} 
                                            className={editingExpense?.isActive ? styles.activeIcon : styles.inactiveIcon}
                                        />
                                        <span>{editingExpense?.isActive ? 'Activo' : 'Inactivo'}</span>
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                    <button type="submit" className={styles.buttonFormField}>
                        {editingExpense ? "Save" : "Add"}
                    </button>
                </form>
            </Modal>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className={styles.card}>
                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Description</th>
                                    <th>Amout</th>
                                    <th>Start Date</th>
                                    <th>Last Payment</th>
                                    <th>Next Payment</th>
                                    <th>State</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredExpenses.map((expense) => (
                                    <tr key={expense.id} className={!expense.isActive ? styles.inactiveRow : ''}>
                                        <td>{expense.description}</td>
                                        <td>${formatMoney(expense.amount)}</td>
                                        <td>{formatDateForDisplay(expense.startDate)}</td>
                                        <td>{getLastPaymentDate(expense)}</td>
                                        <td>{getNextPaymentDate(expense)}</td>
                                        <td>
                                            <button
                                                onClick={() => toggleActive(expense)}
                                                className={styles.toggleButton}
                                                title={expense.isActive ? "Deactivate" : "Activate"}
                                            >
                                                <FontAwesomeIcon 
                                                    icon={expense.isActive ? faToggleOn : faToggleOff} 
                                                    className={expense.isActive ? styles.activeIcon : styles.inactiveIcon}
                                                />
                                            </button>
                                        </td>
                                        <td>
                                            <div className={styles.actions}>
                                                <button
                                                    onClick={() => handleEdit(expense)}
                                                    className={styles.buttonEdit}
                                                >
                                                    Edit
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(expense.id)} 
                                                    className={styles.buttonDelete}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredExpenses.length === 0 && (
                                    <tr>
                                        <td colSpan={7}>No fixed expenses.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <div className={styles.summary}>
                <div className={styles.summaryItem}>
                    <h3>Total Active Fixed Expenses</h3>
                    <p>${formatMoney(fixedExpenses
                        .filter(expense => expense.isActive)
                        .reduce((total, expense) => total + expense.amount, 0))}</p>
                </div>
                <div className={styles.summaryItem}>
                    <h3>Amount of Fixed Expenses</h3>
                    <p>{fixedExpenses.filter(expense => expense.isActive).length} active</p>
                </div>
            </div>
        </div>
    );
}