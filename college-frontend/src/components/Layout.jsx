import { Link, Outlet, useLocation } from "react-router-dom";
import "./Layout.css";

export default function Layout() {
  const location = useLocation();
  const isActive = (path) => (location.pathname === path ? "active" : "");

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="nav-brand">
          <h2>Gestion de Collège</h2>
        </div>
        <ul className="nav-links">
          <li><Link to="/" className={isActive("/")}>Accueil</Link></li>
          <li><Link to="/eleves" className={isActive("/eleves")}>Élèves</Link></li>
          <li><Link to="/professeurs" className={isActive("/professeurs")}>Professeurs</Link></li>
          <li><Link to="/notes" className={isActive("/notes")}>Notes</Link></li>
          <li><Link to="/classes" className={isActive("/classes")}>Classes</Link></li>
        </ul>
      </nav>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}