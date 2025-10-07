import React, { useState } from 'react';
import ListaUsuarios from '../components/ListaUsuarios';
import CrearUsuarioForm from '../components/CrearUsuarioForm';
import { useNavigate } from 'react-router-dom';

const GestionarUsuarios = ({ user }) => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);

  if (!user || user.rol !== 'administrador') {
    navigate('/');
    return null;
  }

  const handleUserCreated = () => {
    setShowForm(false);
    window.location.reload();
  };

  return (
    <div className="container mt-4">
      <h2>Gestión de Usuarios</h2>
      <div className="row">
        <div className="col-12 mb-4">
          <button 
            className="btn btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Cancelar" : "Crear Nuevo Usuario"}
          </button>
        </div>

        {showForm && (
          <div className="col-12 mb-4">
            <CrearUsuarioForm onUserCreated={handleUserCreated} />
          </div>
        )}
        
        <div className="col-12">
          <ListaUsuarios />
        </div>
      </div>
    </div>
  );
};

export default GestionarUsuarios;