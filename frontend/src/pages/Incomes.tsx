import { useState, useEffect } from 'react';
import styles from '../styles/global.module.css';
import { getIncomes, createIncome, deleteIncome, updateIncome } from '../services/incomeService';
import { getCurrentUser } from '../services/authService';
import type { Income } from '../types';
import Modal from '../components/Modal';
import FormField from '../components/FormField';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { formatMoney } from '../utils/formatMoney';
import { getLocalDateFromStr, isSameMonth, formatDateForDisplay } from '../utils/dateUtils';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Incomes() {
    const [incomes, setIncomes] = useState<Income[]>([]);
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [type, setType] = useState('regular');
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [editingIncome, setEditingIncome] = useState<Income | null>(null);
    const currentUser = getCurrentUser();

    const fetchIncomes = async () => {
        if (!currentUser) return;
        setLoading(true);
        try {
            const data = await getIncomes();
            // Filter incomes for current month using the new utility
            const filteredIncomes = data.filter(income => {
                const incomeDate = getLocalDateFromStr(income.date);
                return isSameMonth(incomeDate, currentMonth);
            });
            setIncomes(filteredIncomes);
        } catch (err) {
            console.error('Error fetching incomes:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (currentUser) {
            fetchIncomes();
        }
    }, [currentMonth]); // Refetch when month changes

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!amount || !date) return;

        try {
            if (editingIncome) {
                await updateIncome(editingIncome.id, {
                    amount: parseFloat(amount),
                    description,
                    date,
                    userId: currentUser?.id || 0,
                    type: type,
                });
            } else {
                await createIncome({
                    amount: parseFloat(amount),
                    description,
                    date,
                    userId: currentUser?.id || 0,
                    type: type,
                });
            }
            setAmount('');
            setDescription('');
            setDate('');
            setType('regular');
            setEditingIncome(null);
            setIsModalOpen(false);
            fetchIncomes();
        } catch (err) {
            console.error('Error creating/updating income:', err);
        }
    }

    const handleDelete = async (id: number) => {
        if (!currentUser) return;
        try {
            await deleteIncome(id);
            fetchIncomes();
        } catch (err) {
            console.error('Error deleting income:', err);
        }
    };

    const handleEdit = (income: Income) => {
        setEditingIncome(income);
        setAmount(income.amount.toString());
        setDescription(income.description || '');
        setDate(new Date(income.date).toISOString().split("T")[0]);
        setType(income.type);
        setIsModalOpen(true);
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
        return date.toLocaleString('us', { month: 'long', year: 'numeric' });
    };

    const getCurrentMonthTotal = () => {
        return incomes.reduce((total, income) => total + income.amount, 0);
    };

    const getCurrentMonthSalary = () => {
        return incomes
            .filter(income => income.type === 'salary')
            .reduce((total, income) => total + income.amount, 0);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Income</h1>
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
            <button 
                className={styles.button}
                style={{
                    
                    marginBottom: '1rem',
                }}
                onClick={() => {
                    setEditingIncome(null);
                    setAmount('');
                    setDescription('');
                    setDate(new Date().toISOString().split('T')[0]);
                    setType('regular');
                    setIsModalOpen(true);
                }}
            >
                Add Income
            </button>

            <Modal 
                isOpen={isModalOpen} 
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingIncome(null);
                }}
                title={editingIncome ? "Edit Income" : "Add Income"}
            >
                <form onSubmit={handleSubmit} className={styles.form}>
                    <FormField
                        label="Description:"
                        name="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <FormField
                        label="Amount:"
                        name="amount"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                    />
                    <FormField
                        label="Date:"
                        name="date"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />
                    <FormField
                        label="Type:"
                        name="type"
                        type="select"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        options={[
                            { value: "regular", label: "Regular Income" },
                            { value: "salary", label: "Salay" }
                        ]}
                    />
                    <button type="submit" className={styles.buttonFormField}>
                        {editingIncome ? "Save" : "Add"}
                    </button>
                </form>
            </Modal>

            {loading ? (
                <LoadingSpinner/>
            ) : (
                <div className={styles.card}>
                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Description</th>
                                    <th>Mount</th>
                                    <th>Date</th>
                                    <th>Type</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {incomes.map((income) => (
                                    <tr key={income.id}>
                                        <td>{income.description || '-'}</td>
                                        <td>${formatMoney(income.amount)}</td>
                                        <td>{formatDateForDisplay(income.date)}</td>
                                        <td>{income.type === 'salary' ? 'Salary' : 'Regular'}</td>
                                        <td>
                                            <div className={styles.actions}>
                                                <button
                                                    onClick={() => handleEdit(income)}
                                                    className={styles.buttonEdit}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(income.id)}
                                                    className={styles.buttonDelete}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {incomes.length === 0 && (
                                    <tr>
                                        <td colSpan={5}>No income.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <div className={styles.summary}>
                <div className={styles.summaryItem}>
                    <h3>Month Total</h3>
                    <p>${formatMoney(getCurrentMonthTotal())}</p>
                </div>
                <div className={styles.summaryItem}>
                    <h3>Salary of the Month</h3>
                    <p>${formatMoney(getCurrentMonthSalary())}</p>
                </div>
            </div>
        </div>
    );
}