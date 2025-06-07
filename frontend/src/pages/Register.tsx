import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../styles/login.module.css';

export default function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/auth/register', {
        username,
        password
      });

      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      navigate('/home');
    } catch (error) {
      console.error('Error al registrarse:', error);
      setError('El nombre de usuario ya existe o hubo un problema.');
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleRegister} className={styles.form}>
        <h2 className={styles.title}>Registrarse</h2>
        {error && <p className={styles.error}>{error}</p>}

        <input
          type="text"
          placeholder="Nombre de usuario"
          className={styles.input}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          className={styles.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className={styles.button}>
          Crear cuenta
        </button>

        <p
          style={{ marginTop: '1rem', cursor: 'pointer', color: '#007bff' }}
          onClick={() => navigate('/')}
        >
          Ya tengo una cuenta
        </p>
      </form>
    </div>
  );
}
