import { useState } from 'react';
import userService from '../services/userService';

const RegistroIndependiente = ({ onSuccess, onRegistroExitoso }) => {
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newUser = {
        username,
        name,
        email,
        password,
        rol: 'independiente',
      };
      await userService.createUser(newUser);
      setMessage({ type: true, message: '¡Registro exitoso! Ahora puedes iniciar sesión.' });
      setUsername('');
      setName('');
      setEmail('');
      setPassword('');
      if (onSuccess) onSuccess();
      if (onRegistroExitoso) onRegistroExitoso();
    } catch (err) {
      setMessage({ type: false, message: err.response?.data?.error || 'Error al registrar.' });
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    marginBottom: '12px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '1rem',
    transition: 'border-color 0.2s',
    outline: 'none'
  };

  const buttonStyle = {
    width: '100%',
    background: '#e94560',
    color: '#fff',
    padding: '12px',
    border: 'none',
    borderRadius: '6px',
    fontWeight: '600',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background 0.2s',
    marginTop: '8px'
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3 style={{ 
        color: '#1a2238', 
        marginBottom: '1.5rem', 
        fontWeight: 700, 
        fontSize: '1.5rem',
        textAlign: 'center'
      }}>
        Registro Independiente
      </h3>

      {message && (
        <div
          style={{
            padding: '12px',
            borderRadius: '6px',
            marginBottom: '16px',
            background: message.type ? '#f0fdf4' : '#fef2f2',
            color: message.type ? '#166534' : '#991b1b',
            border: `1px solid ${message.type ? '#bbf7d0' : '#fecaca'}`
          }}
        >
          {message.message}
        </div>
      )}
      
      <div style={{ marginBottom: '16px' }}>
        <label htmlFor="username" style={{ display: 'block', marginBottom: '8px', color: '#4a5568', fontWeight: '500' }}>
          Nombre de usuario
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
          style={inputStyle}
        />
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label htmlFor="fullname" style={{ display: 'block', marginBottom: '8px', color: '#4a5568', fontWeight: '500' }}>
          Nombre completo
        </label>
        <input
          id="fullname"
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          style={inputStyle}
        />
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label htmlFor="email" style={{ display: 'block', marginBottom: '8px', color: '#4a5568', fontWeight: '500' }}>
          Correo electrónico
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={inputStyle}
        />
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label htmlFor="password" style={{ display: 'block', marginBottom: '8px', color: '#4a5568', fontWeight: '500' }}>
          Contraseña
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={inputStyle}
        />
      </div>

      <button
        type="submit"
        style={buttonStyle}
        onMouseOver={e => e.target.style.background = '#d13651'}
        onMouseOut={e => e.target.style.background = '#e94560'}
      >
        Registrarme
      </button>
    </form>
  );
};

export default RegistroIndependiente;