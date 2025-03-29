import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    window.location.reload(); // <- fuerza un reinicio completo de la app
    
  };

  

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <span className="app-title">💸 Finanzas Personales</span>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/historial">Historial</Link>
        <Link to="/fixed-expenses/new">Gastos Fijos</Link>
      </div>

      <div className="navbar-right">
        <span className="username">👤 {user.name}</span>
        <button onClick={handleLogout}>Salir</button>
      </div>
    </nav>
  );
};

export default Navbar;