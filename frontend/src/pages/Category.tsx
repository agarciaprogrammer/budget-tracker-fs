import { useEffect, useState } from 'react';
import styles from '../styles/global.module.css';
import { getCategories, createCategory } from '../services/categoryService';
import { getCurrentUser } from '../services/authService';
import type { Category } from '../types';

export default function Category() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
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
      const newCategory = await createCategory({ 
        name: newCategoryName,
        userId: currentUser.id 
      });
      setCategories(prev => [...prev, newCategory]);
      setNewCategoryName('');
      setError('');
    } catch (err) {
      console.error('Error creando categoría:', err);
      setError('No se pudo crear la categoría');
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
                <th>ID</th>
                <th>Nombre</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td>{category.id}</td>
                  <td>{category.name}</td>
                  <td>
                    <button className={styles.buttonDelete}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
