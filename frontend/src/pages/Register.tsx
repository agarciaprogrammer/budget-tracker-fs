import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import styles from '../styles/login.module.css';

export default function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/register', {
        username,
        password
      });

      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      navigate('/home');
    } catch (error) {
      console.error('Error al registrarse:', error);
      setError('The username already exists or there was a problem.');
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleRegister} className={styles.form}>
        <h2 className={styles.title}>Sign In</h2>
        {error && <p className={styles.error}>{error}</p>}

        <input
          type="text"
          placeholder="Username"
          className={styles.input}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className={styles.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className={styles.button}>
          Create account
        </button>

        <p
          style={{ marginTop: '1rem', cursor: 'pointer', color: '#007bff' }}
          onClick={() => navigate('/')}
        >
          I already have an account
        </p>
      </form>
    </div>
  );
}
