import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Menu.css';

const Menu = ({ user }) => {
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    window.localStorage.removeItem('loggedMafiestUser')
    navigate('/')
  }

  const isCurrentPath = (path) => location.pathname === path

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">MAFIEST</Link>
      </div>
      <ul className="nav-links">
        <li>
          <Link to="/" className={isCurrentPath('/') ? 'active' : ''}>
            Inicio
          </Link>
        </li>
        {user ? (
          <>
            <li>
              <Link to="/actividades" className={isCurrentPath('/actividades') ? 'active' : ''}>
                Actividades
              </Link>
            </li>
            {user.rol === 'administrador' && (
              <li>
                <Link to="/ver-actividades" className={isCurrentPath('/ver-actividades') ? 'active' : ''}>
                  Ver Actividades
                </Link>
              </li>
            )}
            {user.rol === 'administrador' && (
              <li>
                <Link to="/contactos" className={isCurrentPath('/contactos') ? 'active' : ''}>
                  Ver Contactos
                </Link>
              </li>
            )}
            <li>
              <button onClick={handleLogout}>
                Cerrar Sesión
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/sobrenosotros" className={isCurrentPath('/sobrenosotros') ? 'active' : ''}>
                Sobre Nosotros
              </Link>
            </li>
            <li>
              <Link to="/contactanos" className={isCurrentPath('/contactanos') ? 'active' : ''}>
                Contáctanos
              </Link>
            </li>
            <li>
              <Link to="/" className="auth-button">
                Iniciar Sesión
              </Link>
            </li>
            <li>
              <Link to="/" className="auth-button register">
                Registro
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Menu;
