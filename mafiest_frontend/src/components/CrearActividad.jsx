import React, { useState } from 'react';
import '../styles/crear-actividad.css';

const CrearActividad = ({ onCrear }) => {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fechaLimite, setFechaLimite] = useState('');
  const [tipo, setTipo] = useState('archivo');
  const [archivo, setArchivo] = useState(null);
  const [preguntas, setPreguntas] = useState([{ 
    pregunta: '', 
    opciones: ['', '', '', ''], 
    esCorrecta: 0 
  }]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const nuevaActividad = {
      titulo,
      descripcion,
      fechaLimite,
      tipo,
      archivo: tipo === 'archivo' ? archivo : undefined,
      preguntas: tipo === 'formulario' ? preguntas : undefined
    };
    onCrear(nuevaActividad);
    // Limpiar el formulario
    setTitulo('');
    setDescripcion('');
    setFechaLimite('');
    setArchivo(null);
    setPreguntas([{ pregunta: '', opciones: ['', '', '', ''], esCorrecta: 0 }]);
  };

  const agregarPregunta = () => {
    setPreguntas([...preguntas, { 
      pregunta: '', 
      opciones: ['', '', '', ''], 
      esCorrecta: 0 
    }]);
  };

  const eliminarPregunta = (index) => {
    if (preguntas.length > 1) {
      setPreguntas(preguntas.filter((_, i) => i !== index));
    }
  };

  const actualizarPregunta = (index, campo, valor) => {
    const nuevasPreguntas = [...preguntas];
    if (campo === 'pregunta') {
      nuevasPreguntas[index].pregunta = valor;
    } else if (campo.startsWith('opcion')) {
      const opcionIndex = parseInt(campo.replace('opcion', ''));
      nuevasPreguntas[index].opciones[opcionIndex] = valor;
    } else if (campo === 'esCorrecta') {
      nuevasPreguntas[index].esCorrecta = parseInt(valor);
    }
    setPreguntas(nuevasPreguntas);
  };

  return (
    <form onSubmit={handleSubmit} className="crear-actividad-form">
      <h2 className="form-title">Crear Nueva Actividad</h2>
      
      <div className="form-group">
        <label htmlFor="titulo">Título:</label>
        <input
          id="titulo"
          value={titulo}
          onChange={e => setTitulo(e.target.value)}
          required
          className="form-control"
          placeholder="Ingrese el título de la actividad"
        />
      </div>

      <div className="form-group">
        <label htmlFor="descripcion">Descripción:</label>
        <textarea
          id="descripcion"
          value={descripcion}
          onChange={e => setDescripcion(e.target.value)}
          required
          className="form-control"
          rows="4"
          placeholder="Describa la actividad"
        />
      </div>

      <div className="form-group">
        <label htmlFor="fechaLimite">Fecha Límite:</label>
        <input
          id="fechaLimite"
          type="datetime-local"
          value={fechaLimite}
          onChange={e => setFechaLimite(e.target.value)}
          required
          className="form-control"
        />
      </div>

      <div className="form-group">
        <label htmlFor="tipo">Tipo de Actividad:</label>
        <select
          id="tipo"
          value={tipo}
          onChange={e => setTipo(e.target.value)}
          className="form-control"
        >
          <option value="archivo">Entrega de Archivo</option>
          <option value="formulario">Formulario de Preguntas</option>
        </select>
      </div>

      {tipo === 'archivo' && (
        <div className="form-group">
          <label htmlFor="archivo">Archivo de la Actividad:</label>
          <input
            id="archivo"
            type="file"
            onChange={e => setArchivo(e.target.files[0])}
            className="form-control"
          />
          <small className="form-text text-muted">
            Sube un archivo con las instrucciones o material necesario
          </small>
        </div>
      )}

      {tipo === 'formulario' && (
        <div className="preguntas-section">
          <h3>Preguntas del Formulario</h3>
          {preguntas.map((pregunta, preguntaIndex) => (
            <div key={preguntaIndex} className="pregunta-container">
              <div className="pregunta-header">
                <h4>Pregunta {preguntaIndex + 1}</h4>
                {preguntas.length > 1 && (
                  <button
                    type="button"
                    onClick={() => eliminarPregunta(preguntaIndex)}
                    className="btn-eliminar"
                  >
                    Eliminar
                  </button>
                )}
              </div>

              <div className="form-group">
                <input
                  value={pregunta.pregunta}
                  onChange={e => actualizarPregunta(preguntaIndex, 'pregunta', e.target.value)}
                  placeholder="Escriba la pregunta"
                  className="form-control"
                  required
                />
              </div>

              {pregunta.opciones.map((opcion, opcionIndex) => (
                <div key={opcionIndex} className="opcion-container">
                  <input
                    type="radio"
                    name={`correcta-${preguntaIndex}`}
                    value={opcionIndex}
                    checked={pregunta.esCorrecta === opcionIndex}
                    onChange={e => actualizarPregunta(preguntaIndex, 'esCorrecta', e.target.value)}
                    required
                  />
                  <input
                    value={opcion}
                    onChange={e => actualizarPregunta(preguntaIndex, `opcion${opcionIndex}`, e.target.value)}
                    placeholder={`Opción ${opcionIndex + 1}`}
                    className="form-control opcion-input"
                    required
                  />
                </div>
              ))}
            </div>
          ))}
          <button
            type="button"
            onClick={agregarPregunta}
            className="btn-agregar"
          >
            Agregar Pregunta
          </button>
        </div>
      )}

      <div className="form-actions">
        <button type="submit" className="btn-submit">
          Crear Actividad
        </button>
      </div>
    </form>
  );
};

export default CrearActividad;
