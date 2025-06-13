import { useState, useEffect } from 'react';
import styles from '../styles/global.module.css';
import { getFixedExpenses, createFixedExpense, deleteFixedExpense } from '../services/fixedExpenseService';
import { getCurrentUser } from '../services/authService';
import type { FixedExpense } from '../types';
import Modal from '../components/Modal';
import FormField from '../components/FormField';

export default function FixedExpenses() {
    const [fixedExpenses, setFixedExpenses] = useState<FixedExpense[]>([]);
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
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
        if (!amount || !description || !date) return;
        try {
            if (!currentUser) return;
            await createFixedExpense({ 
                amount: Number(amount), 
                description, 
                date, 
                userId: currentUser.id 
            });
            setAmount('');
            setDescription('');
            setDate('');
            setIsModalOpen(false);
            fetchFixedExpenses();
        } catch (err) {
            console.error('Error creating fixed expense:', err);
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
    
    return (
        <div className={styles.container}>
            <h1>Gastos Fijos</h1>
            <button onClick={() => setIsModalOpen(true)} className={styles.addButton}>Agregar Gasto Fijo</button>
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Nuevo Gasto Fijo"
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
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                    <FormField
                        label="Fecha: "
                        name="date"
                        value={date}
                        type="date"
                        onChange={(e) => setDate(e.target.value)}
                    />
                    <button type="submit" className={styles.buttonFormField}>Agregar</button>
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
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {fixedExpenses.map((expense) => (
                                    <tr key={expense.id}>
                                        <td>{expense.description}</td>
                                        <td>{expense.amount}</td>
                                        <td>{new Date(expense.date).toLocaleDateString('es-AR', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                        })}</td>
                                        <td>
                                            <button onClick={() => handleDelete(expense.id)} className={styles.buttonDelete}>Eliminar</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}