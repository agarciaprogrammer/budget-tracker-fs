import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import api from '../services/api';
import styles from '../styles/login.module.css';

export default function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [loginSuccess, setLoginSuccess] = useState(false);


    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setLoginSuccess(false);

        try {
            const response = await api.post('/auth/login', {username, password});
            const { token, user } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            navigate('/home');
            setLoginSuccess(true);
        } catch (error) {
            console.error('Login failed:', error);
            setError('Usuario o contraseña incorrectos');
        }
        setIsLoading(false);
    };

  
  const handleRegisterRedirect = () => {
    navigate('/register');
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleLogin} className={styles.form}>
        <h2 className={styles.title}>Iniciar Sesión</h2>
        {error && <p className={styles.error}>{error}</p>}
        {isLoading && <p className={styles.loading}>Cargando...</p>}
        {loginSuccess && <p className={styles.success}>Inicio de sesión exitoso</p>}

        <input
          type="text"
          placeholder="Usuario"
          className={styles.input}
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          className={styles.input}
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        <button type="submit" className={styles.button} style={{width: '94%'}}>
          Ingresar
        </button>

        <button
          type="button"
          className={styles.secondaryButton}
          onClick={handleRegisterRedirect}
        >
          Registrarse
        </button>
      </form>
    </div>
  );
}
