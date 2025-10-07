import React, { useState } from 'react';
import * as userService from "../services/user";

const CrearUsuarioForm = ({ onUserCreated }) => {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [Rol, setRol] = useState("estudiante");
  const [grupoId, setGrupoId] = useState("");
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const newUser = {
        username,
        name,
        email,
        password,
        Rol,
        grupoId: grupoId || null
      };
      
      await userService.createUser(newUser);
      setMessage("✅ Usuario creado correctamente");
      
      // Limpiar formulario
      setUsername("");
      setName("");
      setEmail("");
      setPassword("");
      setRol("estudiante");
      setGrupoId("");
      
      if (onUserCreated) {
        onUserCreated();
      }
      
    } catch (error) {
      console.error('Error:', error);
      setMessage(`❌ ${error.response?.data?.error || error.message}`);
    }

    setTimeout(() => setMessage(null), 4000);
  };

  return (
    <div className="card">
      <div className="card-body">
        <h3 className="card-title">Crear Usuario</h3>
        {message && <div className="alert alert-info">{message}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Usuario: </label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              minLength={3}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Nombre: </label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Correo: </label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Contraseña: </label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Rol: </label>
            <select 
              className="form-select"
              value={Rol} 
              onChange={e => setRol(e.target.value)}
              required
            >
              <option value="estudiante">Estudiante</option>
              <option value="docente">Docente</option>
              <option value="administrador">Administrador</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Grupo ID: </label>
            <input
              type="number"
              className="form-control"
              value={grupoId}
              onChange={e => setGrupoId(e.target.value)}
              required={Rol === 'estudiante'}
              placeholder={Rol === 'estudiante' ? 'Obligatorio para estudiantes' : 'Opcional'}
            />
            <small className="form-text text-muted">
              {Rol === 'estudiante' ? 'El ID del grupo es obligatorio para estudiantes' : 'Opcional para este rol'}
            </small>
          </div>
          <button type="submit" className="btn btn-success">Crear Usuario</button>
        </form>
      </div>
    </div>
  );
};

export default CrearUsuarioForm;