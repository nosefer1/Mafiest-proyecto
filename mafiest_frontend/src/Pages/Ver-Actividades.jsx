import { useState, useEffect } from "react"
import { obtenerActividadesVisibles, setToken, responderActividad } from "../services/actividades"
import { subirRespuestaArchivo, eliminarRespuesta, obtenerRespuestasActividad } from '../services/respuestasActividad'
import Menu from '../components/Menu'
import '../styles/respuestaactividad.css';

import React from 'react';

const RespuestaArchivo({ actividad, user }) {
  const [archivo, setArchivo] = React.useState(null);
  const [archivoUrl, setArchivoUrl] = React.useState('');
  const [respuesta, setRespuesta] = React.useState(null);
  const [mensaje, setMensaje] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    obtenerRespuestasActividad(actividad.id).then(respuestas => {
      const mirezp = respuestas.find(r => r.userId === user.id);
      setRespuesta(mirezp || null);
    });
  }, [actividad.id, user.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await subirRespuestaArchivo(actividad.id, archivo, archivoUrl);
      setMensaje('Respuesta enviada correctamente');
      setArchivo(null); setArchivoUrl('');
      const respuestas = await obtenerRespuestasActividad(actividad.id);
      setRespuesta(respuestas.find(r => r.userId === user.id));
    } catch (err) {
      setMensaje('Error al enviar respuesta');
    }
    setLoading(false);
    setTimeout(() => setMensaje(null), 3000);
  };

  const handleDelete = async () => {
    if (!respuesta) return;
    setLoading(true);
    try {
      await eliminarRespuesta(respuesta.id);
      setRespuesta(null);
      setMensaje('Respuesta eliminada');
    } catch {
      setMensaje('Error al eliminar respuesta');
    }
    setLoading(false);
    setTimeout(() => setMensaje(null), 3000);
  };

  if (respuesta) {
    return (
      <div className="respuesta-form">
        <div className="respuesta-archivo">
          <b>Tu respuesta:</b> {respuesta.archivoUrl ? <a href={respuesta.archivoUrl} target="_blank" rel="noopener noreferrer">Ver archivo</a> : 'Sin archivo'}
        </div>
        {respuesta.retroalimentacion && (
          <div className="retroalimentacion-box">
            <b>Retroalimentación:</b> {respuesta.retroalimentacion}
            {respuesta.nota && <span className="nota-box">Nota: {respuesta.nota}/5</span>}
          </div>
        )}
        <button onClick={handleDelete} disabled={loading}>Eliminar respuesta</button>
      </div>
    );
  }

  return (
    <form className="respuesta-form" onSubmit={handleSubmit}>
      <label>Subir archivo de respuesta:</label>
      <input type="file" onChange={e => setArchivo(e.target.files[0])} />
      <label>o ingresa una URL:</label>
      <input type="text" value={archivoUrl} onChange={e => setArchivoUrl(e.target.value)} placeholder="https://..." />
      <button type="submit" disabled={loading || (!archivo && !archivoUrl)}>
        {loading ? 'Enviando...' : 'Enviar respuesta'}
      </button>
      {mensaje && <div style={{ color: mensaje.includes('Error') ? 'red' : 'green', marginTop: 8 }}>{mensaje}</div>}
    </form>
  );
}

const VerActividades = ({ user }) => {
  const [actividades, setActividades] = useState([])
  const [mensaje, setMensaje] = useState(null)

  useEffect(() => {
    if (user?.token) {
      setToken(user.token)
    }
  }, [user])

  useEffect(() => {
    const cargarActividades = async () => {
      if (user?.token && (user?.Rol === 'estudiante' || user?.Rol === 'independiente')) {
        try {
          const visibles = await obtenerActividadesVisibles()
          if (Array.isArray(visibles)) {
            setActividades(visibles)
            if (visibles.length === 0) {
              setMensaje("No hay actividades disponibles")
            }
          } else {
            console.error('La respuesta no es un array:', visibles)
            setMensaje("Error al cargar las actividades")
          }
        } catch (error) {
          console.error('Error al cargar actividades:', error)
          setMensaje("Error al cargar las actividades")
        }
      }
    }
    cargarActividades()
  }, [user?.token])

  const handleResponderPregunta = async (actividadId, preguntaIndex, respuestaIndex) => {
    try {
      const actividadActualizada = await responderActividad(actividadId, preguntaIndex, respuestaIndex)
      if (actividadActualizada) {
        setActividades(actividades.map(act =>
          act.id === actividadId ? actividadActualizada : act
        ))
        const pregunta = actividadActualizada.preguntas[preguntaIndex]
        const respuestaUsuario = pregunta.respuestas?.find(r => r.usuarioId === user.id)
        const esCorrecta = pregunta.opciones[respuestaUsuario?.seleccion]?.esCorrecta
        setMensaje(esCorrecta ? "¡Correcto! 🎉" : "Incorrecto. Inténtalo de nuevo 😟")
      }
    } catch (error) {
      console.error('Error al responder:', error)
      setMensaje(error?.response?.data?.error || "Error al enviar la respuesta")
    }
    setTimeout(() => setMensaje(null), 3000)
  }

  const actividadesPendientes = actividades.filter(actividad => {
    const preguntas = Array.isArray(actividad.preguntas) ? actividad.preguntas : []
    if (actividad.tipo === 'formulario' && preguntas.length === 0) return false
    if (actividad.tipo === 'archivo' && !actividad.archivoUrl) return false
    // Verificar respuestas del usuario solo para formularios
    let haRespondidoTodas = false
    if (actividad.tipo === 'formulario') {
      const respuestasUsuario = preguntas.map(p =>
        Array.isArray(p.respuestas) ? p.respuestas.find(r => r.usuarioId === user.id) : null
      )
      haRespondidoTodas = respuestasUsuario.every(r => r && r.seleccion !== undefined)
    }
    const hoy = new Date(); hoy.setHours(0,0,0,0)
    const fechaLimite = new Date(actividad.fechaLimite); fechaLimite.setHours(0,0,0,0)
    return (!haRespondidoTodas) && fechaLimite >= hoy
  })
  return (
    <div className="actividades-container">
      <Menu user={user} />
      <h2>Actividades Disponibles</h2>
      {mensaje && (
        <p className={`mensaje ${mensaje.includes("Error") ? "error" : "success"}`}>
          {mensaje}
        </p>
      )}

      {(user?.Rol === 'estudiante' || user?.Rol === 'independiente') ? (
        actividadesPendientes.length === 0 ? (
          <p className="sin-actividades">🎉 ¡No tienes actividades pendientes!</p>
        ) : (
          <ul className="actividades-lista">
            {actividadesPendientes.map(actividad => (
              <li key={actividad.id} className="actividad-item">
                <div className="actividad-header">
                  <h3>{actividad.titulo}</h3>
                  <span className="estado pendiente">Pendiente</span>
                  <span style={{ marginLeft: 12, fontSize: 13, color: actividad.global ? '#e94560' : '#1a2238', fontWeight: 600 }}>
                    {actividad.global ? 'Global (Administrador)' : (actividad.autor?.rol === 'docente' ? 'Docente' : '')}
                  </span>
                  <span style={{ marginLeft: 12, fontSize: 13, color: '#888' }}>
                    {actividad.tipo === 'archivo' ? 'Archivo' : 'Formulario'}
                  </span>
                </div>
                <p className="descripcion">{actividad.descripcion}</p>
                <p className="fecha">Fecha límite: {new Date(actividad.fechaLimite).toLocaleDateString()}</p>
                <p className="profesor">Asignado por: {actividad.autor?.name || actividad.autor?.username || 'Desconocido'}</p>


                {actividad.tipo === 'archivo' && actividad.archivoUrl && (
                  <div style={{ margin: '8px 0' }}>
                    <a href={actividad.archivoUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#e94560', fontWeight: 600 }}>
                      Descargar/Ver archivo
                    </a>
                  </div>
                )}
                {actividad.tipo === 'archivo' && (
                  <RespuestaArchivo actividad={actividad} user={user} />
                )}

                {actividad.tipo === 'formulario' && (
                  <div className="preguntas-container">
                    {actividad.preguntas?.map((pregunta, preguntaIndex) => {
                      const respuestaUsuario = pregunta.respuestas?.find(r => r.usuarioId === user.id)
                      return (
                        <div key={preguntaIndex} className="pregunta-item">
                          <h4>Pregunta {preguntaIndex + 1}: {pregunta.pregunta}</h4>
                          <div className="opciones-lista">
                            {pregunta.opciones.map((opcion, opcionIndex) => (
                              <button
                                key={opcionIndex}
                                onClick={() => handleResponderPregunta(actividad.id, preguntaIndex, opcionIndex)}
                                disabled={!!respuestaUsuario}
                                className={`opcion-btn ${
                                  respuestaUsuario?.seleccion === opcionIndex ? 'respondida' : ''
                                }`}
                              >
                                {opcion.texto}
                              </button>
                            ))}
                          </div>
                          {respuestaUsuario && (
                            <p className="respuesta-info">
                              Tu respuesta: {pregunta.opciones[respuestaUsuario.seleccion]?.texto}
                            </p>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )
      ) : (
        <p className="no-permisos">No tienes permisos para ver las actividades</p>
      )}
    </div>
  )

}
export default VerActividades
