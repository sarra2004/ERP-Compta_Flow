import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>Compta Flow</h1>
      </div>
      <ul className="navbar-menu">
        <li><Link to="/">Tableau de bord</Link></li>
        <li><Link to="/comptes">Plan Comptable</Link></li>
        <li><Link to="/journal-entries">Écritures Comptables</Link></li>
        <li><Link to="/factures">Factures</Link></li>
        <li><Link to="/tresorerie">Trésorerie</Link></li>
        <li><Link to="/periods">Périodes Comptables</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
