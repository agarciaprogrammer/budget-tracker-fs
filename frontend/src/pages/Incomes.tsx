import { useState, useEffect } from 'react';
import styles from '../styles/global.module.css';
import { getIncomes, createIncome, deleteIncome } from '../services/incomeService';
import { getCurrentUser } from '../services/authService';
import type { Income } from '../types';
import Modal from '../components/Modal';
import FormField from '../components/FormField';  

export default function Incomes() {
    const [incomes, setIncomes] = useState<Income[]>([]);
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [type, setType] = useState('regular');
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const currentUser = getCurrentUser();

    const fetchIncomes = async () => {
        if (!currentUser) return;
        setLoading(true);
        try {
            const data = await getIncomes();
            setIncomes(data);
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
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!amount || !date) return;

        try {
            await createIncome({
                amount: parseFloat(amount),
                description,
                date,
                userId: currentUser?.id || 0,
                type: type,
            });
            setAmount('');
            setDescription('');
            setDate('');
            fetchIncomes();
        } catch (err) {
            console.error('Error creating income:', err);
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

    const getCurrentMonthTotal = () => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        
        // Sum all incomes (both salary and non-salary) for the current month
        return incomes
            .filter(income => {
                const incomeDate = new Date(income.date);
                return incomeDate.getMonth() === currentMonth && 
                       incomeDate.getFullYear() === currentYear;
            })
            .reduce((total, income) => total + income.amount, 0);
    };

    const getCurrentMonthSalary = () => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        
        return incomes
            .filter(income => {
                const incomeDate = new Date(income.date);
                return incomeDate.getMonth() === currentMonth && 
                       incomeDate.getFullYear() === currentYear &&
                       income.type === 'salary';
            })
            .reduce((total, income) => total + income.amount, 0);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Ingresos</h1>
                <button 
                    className={styles.button}
                    onClick={() => setIsModalOpen(true)}
                >
                    Agregar Ingreso
                </button>
            </div>

            <Modal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
                title="Agregar Ingreso"
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
                        Agregar
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
                                            {new Date(income.date).toLocaleDateString('es-AR', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric',
                                            })}
                                        </td>
                                        <td>{income.type === 'salary' ? 'Sueldo' : 'Regular'}</td>
                                        <td>
                                            <div className={styles.actions}>
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
                                        <td colSpan={4}>Sin ingresos registrados.</td>
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