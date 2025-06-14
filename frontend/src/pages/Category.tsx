import { useEffect, useState } from 'react';
import styles from '../styles/global.module.css';
import { getCategories, createCategory, deleteCategory } from '../services/categoryService';
import { getCurrentUser } from '../services/authService';
import type { Category } from '../types';
import Modal from '../components/Modal';

export default function Category() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);
  const currentUser = getCurrentUser();

  const fetchCategories = async () => {
    if (!currentUser) {
      setError('Usuario no autenticado');
      return;
    }

    setLoading(true);
    try {
      const data = await getCategories();
      // Filter categories by current user's ID
      const userCategories = data.filter(category => category.userId === currentUser.id);
      setCategories(userCategories);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Error al cargar las categorías');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim() || !currentUser) return;

    try {
      // Check if category name already exists for this user
      const existingCategory = categories.find(
        cat => cat.name.toLowerCase() === newCategoryName.toLowerCase() && cat.userId === currentUser.id
      );

      if (existingCategory) {
        setError('Ya tienes una categoría con este nombre. Por favor, usa un nombre diferente.');
        return;
      }

      const newCategory = await createCategory({ 
        name: newCategoryName,
        userId: currentUser.id 
      });
      setCategories(prev => [...prev, newCategory]);
      setNewCategoryName('');
      setError('');
    } catch (err: any) {
      console.error('Error creando categoría:', err);
      if (err.response?.status === 409) {
        setError('Ya existe una categoría con este nombre. Por favor, usa un nombre diferente.');
      } else {
        setError('No se pudo crear la categoría. Por favor, intente nuevamente.');
      }
    }
  };

  const handleDelete = (id: number) => {
    setCategoryToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;
    try {
      await deleteCategory(categoryToDelete);
      setCategories(prev => prev.filter(cat => cat.id !== categoryToDelete));
      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
      setError('');
    } catch (err: any) {
      console.error('Error deleting category:', err);
      if (err.response?.status === 500) {
        setError('No se puede eliminar esta categoría porque está siendo utilizada en gastos existentes. Primero elimine o modifique los gastos asociados.');
      } else {
        setError('No se pudo eliminar la categoría. Por favor, intente nuevamente.');
      }
      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className={styles.container}> 
      <form onSubmit={handleCreateCategory} className={styles.formFields}>
        <h1 className={styles.title}>Categorías</h1>
        <input
          type="text"
          placeholder="Nueva categoría"
          value={newCategoryName}
          onChange={e => setNewCategoryName(e.target.value)}
          className={styles.input}
          required
        />
        <button type="submit" className={styles.button}>
          Crear categoría
        </button>
      </form>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.card}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td>{category.name}</td>
                  <td>
                    <button 
                      onClick={() => handleDelete(category.id)}
                      className={styles.buttonDelete}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setCategoryToDelete(null);
        }}
        title="Confirmar Eliminación"
      >
        <div className={styles.deleteConfirmation}>
          <p>¿Estás seguro que deseas eliminar esta categoría?</p>
          <div className={styles.deleteActions}>
            <button 
              onClick={() => {
                setIsDeleteModalOpen(false);
                setCategoryToDelete(null);
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
    </div>
  );
}
