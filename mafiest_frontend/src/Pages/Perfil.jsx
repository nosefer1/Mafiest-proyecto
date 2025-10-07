import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import userService from '../services/user';

const Perfil = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    password: ''
  });

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    setUserData({
      nombre: user.nombre || '',
      email: user.email || '',
      telefono: user.telefono || '',
      password: ''
    });
  }, [user, navigate]);

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = await userService.updateUser(user.id, userData);
      setUser({
        ...user,
        ...updatedUser
      });
      alert('Perfil actualizado exitosamente');
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      alert('Error al actualizar el perfil');
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem('loggedMafiestUser');
    setUser(null);
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="container mt-4">
      <h2>Mi Perfil</h2>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-3">
          <label htmlFor="nombre" className="form-label">Nombre</label>
          <input
            type="text"
            className="form-control"
            id="nombre"
            name="nombre"
            value={userData.nombre}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="telefono" className="form-label">Teléfono</label>
          <input
            type="tel"
            className="form-control"
            id="telefono"
            name="telefono"
            value={userData.telefono}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Nueva Contraseña (dejar en blanco para mantener la actual)</label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            value={userData.password}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Guardar Cambios
        </button>
        <button 
          type="button" 
          className="btn btn-danger ms-3"
          onClick={handleLogout}
        >
          Cerrar Sesión
        </button>
      </form>
    </div>
  );
};

export default Perfil;