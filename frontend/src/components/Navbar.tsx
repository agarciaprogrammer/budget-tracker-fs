import { Link, useNavigate } from 'react-router-dom';
import navStyle from '../styles/navbar.module.css';
import { logout } from '../services/authService';

export default function Navbar() {
    const navigate = useNavigate();

    const handleLogout = () => {
      console.log("Starting Logout");
      logout();
      navigate('/');
    };

    return (
    <nav className={navStyle.navbar}>
      <ul className={navStyle.navList}>
        <li><Link to="/home" className={navStyle.link}>Home</Link></li>
        <li><Link to="/dashboard" className={navStyle.link}>Dashboard</Link></li>
        <li><Link to="/expenses" className={navStyle.link}>Expenses</Link></li>
        <li><Link to="/category" className={navStyle.link}>Categories</Link></li>
        <li><Link to="/incomes" className={navStyle.link}>Incomes</Link></li>
        <li><button onClick={handleLogout} className={navStyle.link} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>Logout</button></li>
      </ul>
    </nav>
  );
}