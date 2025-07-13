import { useEffect, useState, type KeyboardEvent } from 'react';
import styles from '../styles/global.module.css';
import { getCategories, createCategory, deleteCategory } from '../services/categoryService';
import { getCurrentUser } from '../services/authService';
import type { Category } from '../types';
import Modal from '../components/Modal';

export default function Category() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  //const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const currentUser = getCurrentUser();

  const fetchCategories = async () => {
    if (!currentUser) {
      setError('User is not authenticated');
      return;
    }

    //setLoading(true);
    try {
      const data = await getCategories();
      // Filter categories by current user's ID
      const userCategories = data.filter(category => category.userId === currentUser.id);
      setCategories(userCategories);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Error fetching categories');
    } finally {
      //setLoading(false);
    }
  };

  const handleButtonClick = () => {
    if (isExpanded) {
      // If expanded, try to submit the form
      if (newCategoryName.trim()) {
        handleCreateCategory();
      }
    } else {
      // If not expanded, just expand
      setIsExpanded(true);
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim() || !currentUser) return;

    try {
      // Check if category name already exists for this user
      const existingCategory = categories.find(
        cat => cat.name.toLowerCase() === newCategoryName.toLowerCase() && cat.userId === currentUser.id
      );

      if (existingCategory) {
        setError('You already have a category with this name. Please use a different name.');
        return;
      }

      const newCategory = await createCategory({ 
        name: newCategoryName,
        userId: currentUser.id 
      });
      setCategories(prev => [...prev, newCategory]);
      setNewCategoryName('');
      setError('');
      setIsExpanded(false);
    } catch (err: any) {
      console.error('Error loading categories:', err);
      if (err.response?.status === 409) {
        setError('You already have a category with this name. Please use a different name.');
      } else {
        setError('The category could not be created. Please try again.');
      }
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleCreateCategory();
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
        setError('This category cannot be deleted because it is being used in existing expenses. First, delete or modify the associated expenses.');
      } else {
        setError('The category could not be created. Please try again.');
      }
      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Add click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const container = document.querySelector(`.${styles.inputContainer}`);
      if (container && !container.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.container}> 
      <div className={styles.formFields}>
        <h1 className={styles.title}>Categorías</h1>
        <div className={styles.inputContainer}>
          <input
            type="text"
            placeholder="New category"
            value={newCategoryName}
            onChange={e => setNewCategoryName(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`${styles.input} ${isExpanded ? styles.inputVisible : ''}`}
            style={{
              width: '70%',
              marginBottom: '2rem',
              marginTop: '-1rem',
            }}
            required
          />
          <button 
            type="button"
            onClick={handleButtonClick}
            className={`${styles.button} ${isExpanded ? styles.buttonExpanded : ''}`}
            style={{
              marginTop: '-1rem',
              marginBottom: '2rem',
            }}
          >
            Add new Category
          </button>
        </div>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.card}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Description</th>
                <th>Actions</th>
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
                      Delete
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
          <p>Are you sure you want to delete this category?</p>
          <div className={styles.deleteActions}>
            <button 
              onClick={() => {
                setIsDeleteModalOpen(false);
                setCategoryToDelete(null);
              }}
              className={styles.buttonCancel}
            >
              Cancel
            </button>
            <button 
              onClick={confirmDelete}
              className={styles.buttonDelete}
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
