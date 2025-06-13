import { useEffect, useState } from 'react';
import styles from '../styles/global.module.css';
import { getCategories, createCategory } from '../services/categoryService';
import type { Category } from '../types';

export default function Category() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Error al cargar las categorías');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    try {
      const newCategory = await createCategory({ name: newCategoryName });
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
      <h1>Categorías</h1>
      <form onSubmit={handleCreateCategory} className={styles.form}>
        <input
          type="text"
          placeholder="Nueva categoría"
          value={newCategoryName}
          onChange={e => setNewCategoryName(e.target.value)}
          className={styles.input}
          required
        /> <br /><br />
        <button type="submit" className={styles.button}>
          Crear
        </button>
      </form>

      {error && <p className={styles.error}>{error}</p>}

      {loading ? (
        <p>Cargando categorías...</p>
      ) : (
        <ul className={styles.list}>
          {categories.map((category) => (
            <li key={category.id} className={styles.listItem}>
              {category.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
