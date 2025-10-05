
import React from 'react';
import Menu from '../components/Menu';
import Login from './Login';
import RegistroIndependiente from './RegistroIndependiente';
import '../styles/landing.css';

const LandingPage = () => {
  return (
    <div className="landing-bg">
      <Menu />
      <div className="landing-main">
        {/* Izquierda: Info Mafiest */}
        <div className="landing-info">
          <h1>Mafiest</h1>
          <p>
            Plataforma moderna para la gestión de actividades, asesorías y comunicación educativa. Accede, responde, recibe retroalimentación y mantente conectado.
          </p>
        </div>
        {/* Derecha: Login y Registro */}
        <div className="landing-form">
          <h2>Inicia sesión</h2>
          <Login />
          <hr className="landing-divider" />
          <h3>¿No tienes cuenta?</h3>
          <RegistroIndependiente />
        </div>
      </div>
      <div className="landing-bottom">
        ¿Ya tienes cuenta? Inicia sesión. ¿Eres independiente? Regístrate aquí.
      </div>
    </div>
  );
};

export default LandingPage;
