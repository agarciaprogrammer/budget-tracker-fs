import { Link, useNavigate } from 'react-router-dom';
import navStyle from '../styles/navbar.module.css';
import { logout } from '../services/authService';

export default function Navbar() {
    const navigate = useNavigate();

    const handleLogout = () => {
      console.log("Iniciando logout");
      logout();
      navigate('/');
    };

    return (
    <nav className={navStyle.navbar}>
      <ul className={navStyle.navList}>
        <li><Link to="/home" className={navStyle.link}>Inicio</Link></li>
        <li><Link to="/dashboard" className={navStyle.link}>Dashboard</Link></li>
        <li><Link to="/expenses" className={navStyle.link}>Gastos</Link></li>
        <li><Link to="/category" className={navStyle.link}>Categorias</Link></li>
        <li><Link to="/incomes" className={navStyle.link}>Ingresos</Link></li>
        <li><Link to="/fixed-expenses" className={navStyle.link}>Gastos Fijos</Link></li>
        <li><button onClick={handleLogout} className={navStyle.link} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>Logout</button></li>
      </ul>
    </nav>
  );
}