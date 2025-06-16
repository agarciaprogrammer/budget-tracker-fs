import { useState, useEffect } from 'react';
import styles from '../styles/global.module.css';
import { getIncomes, createIncome, deleteIncome, updateIncome } from '../services/incomeService';
import { getCurrentUser } from '../services/authService';
import type { Income } from '../types';
import Modal from '../components/Modal';
import FormField from '../components/FormField';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

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
            // Filter incomes for current month
            const filteredIncomes = data.filter(income => {
                const incomeDate = new Date(income.date);
                return incomeDate.getMonth() === currentMonth.getMonth() &&
                       incomeDate.getFullYear() === currentMonth.getFullYear();
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
        setDate(income.date);
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
        return date.toLocaleString('es-AR', { month: 'long', year: 'numeric' });
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
                <h1 className={styles.title}>Ingresos</h1>
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
                    setDate('');
                    setType('regular');
                    setIsModalOpen(true);
                }}
            >
                Agregar Ingreso
            </button>

            <Modal 
                isOpen={isModalOpen} 
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingIncome(null);
                }}
                title={editingIncome ? "Editar Ingreso" : "Agregar Ingreso"}
            >
                <form onSubmit={handleSubmit} className={styles.form}>
                    <FormField
                        label="Descripción:"
                        name="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <FormField
                        label="Monto:"
                        name="amount"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                    />
                    <FormField
                        label="Fecha:"
                        name="date"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />
                    <FormField
                        label="Tipo:"
                        name="type"
                        type="select"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        options={[
                            { value: "regular", label: "Ingreso Regular" },
                            { value: "salary", label: "Sueldo" }
                        ]}
                    />
                    <button type="submit" className={styles.buttonFormField}>
                        {editingIncome ? "Guardar" : "Agregar"}
                    </button>
                </form>
            </Modal>

            {loading ? (
                <p>Cargando...</p>
            ) : (
                <div className={styles.card}>
                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Descripción</th>
                                    <th>Monto</th>
                                    <th>Fecha</th>
                                    <th>Tipo</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {incomes.map((income) => (
                                    <tr key={income.id}>
                                        <td>{income.description || '-'}</td>
                                        <td>${income.amount.toFixed(2)}</td>
                                        <td>
                                            {new Date(new Date(income.date).getTime() + 24 * 60 * 60 * 1000).toLocaleDateString('es-AR', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric',
                                            })}
                                        </td>
                                        <td>{income.type === 'salary' ? 'Sueldo' : 'Regular'}</td>
                                        <td>
                                            <div className={styles.actions}>
                                                <button
                                                    onClick={() => handleEdit(income)}
                                                    className={styles.buttonEdit}
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(income.id)}
                                                    className={styles.buttonDelete}
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {incomes.length === 0 && (
                                    <tr>
                                        <td colSpan={5}>Sin ingresos registrados.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <div className={styles.summary}>
                <div className={styles.summaryItem}>
                    <h3>Total del Mes</h3>
                    <p>${getCurrentMonthTotal().toFixed(2)}</p>
                </div>
                <div className={styles.summaryItem}>
                    <h3>Sueldo del Mes</h3>
                    <p>${getCurrentMonthSalary().toFixed(2)}</p>
                </div>
            </div>
        </div>
    );
}