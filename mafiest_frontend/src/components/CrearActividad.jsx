import React, { useState } from 'react';

const CrearActividad = ({ onCrear }) => {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fechaLimite, setFechaLimite] = useState('');
  const [tipo, setTipo] = useState('archivo');
  const [archivo, setArchivo] = useState(null);
  const [preguntas, setPreguntas] = useState([{ pregunta: '', opciones: [''], esCorrecta: 0 }]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const nuevaActividad = {
      titulo,
      descripcion,
      fechaLimite,
      tipo,
      archivo,
      preguntas: tipo === 'formulario' ? preguntas : undefined
    };
    onCrear(nuevaActividad);
  };

  return (
    <form onSubmit={handleSubmit} className="crear-actividad-form">
      <h2>Crear Nueva Actividad</h2>
      <label>Título:</label>
      <input value={titulo} onChange={e => setTitulo(e.target.value)} required />
      <label>Descripción:</label>
      <textarea value={descripcion} onChange={e => setDescripcion(e.target.value)} required />
      <label>Fecha Límite:</label>
      <input type="date" value={fechaLimite} onChange={e => setFechaLimite(e.target.value)} required />
      <label>Tipo:</label>
      <select value={tipo} onChange={e => setTipo(e.target.value)}>
        <option value="archivo">Archivo</option>
        <option value="formulario">Formulario</option>
      </select>
      {tipo === 'archivo' && (
        <>
          <label>Archivo:</label>
          <input type="file" onChange={e => setArchivo(e.target.files[0])} />
        </>
      )}
      {tipo === 'formulario' && (
        <div>
          <label>Preguntas:</label>
          {/* Aquí podrías agregar lógica para agregar preguntas dinámicamente */}
          <input value={preguntas[0].pregunta} onChange={e => setPreguntas([{ ...preguntas[0], pregunta: e.target.value }])} placeholder="Pregunta 1" />
        </div>
      )}
      <button type="submit">Crear Actividad</button>
    </form>
  );
};

export default CrearActividad;
