import { useState, useEffect } from 'react'
import { crearActividad, setToken, obtenerMisActividades } from '../services/actividadesService'
import Menu from "../components/Menu"


const Actividades = ({ user }) => {
  const [titulo, setTitulo] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [fechaLimite, setFechaLimite] = useState("")
  const [mensaje, setMensaje] = useState(null)
  const [actividades, setActividades] = useState([])
  const [errorActividades, setErrorActividades] = useState(null)
  const [tipo, setTipo] = useState('formulario')
  const [archivo, setArchivo] = useState(null)
  const [archivoUrl, setArchivoUrl] = useState("")
  const [preguntas, setPreguntas] = useState([{
    pregunta: '',
    opciones: [{ texto: '', esCorrecta: false }]
  }])

  useEffect(() => {
    if (user?.token) {
      console.log('Estableciendo token en Tareas:', user.token)
      setToken(user.token)
    }
  }, [user])

  // Modificar la validación de roles
  useEffect(() => {
    const cargarActividades = async () => {
      if (user?.token && (user?.Rol === 'docente' || user?.Rol === 'administrador')) {
        try {
          const misActividades = await obtenerMisActividades()
          if (Array.isArray(misActividades)) {
            setActividades(misActividades)
            setErrorActividades(null)
          } else {
            console.error('La respuesta no es un array:', misActividades)
            setActividades([])
            setErrorActividades('No se pudieron cargar las actividades correctamente')
          }
        } catch (error) {
          console.error('Error al cargar actividades:', error)
          setActividades([])
          setMensaje("Error al cargar las actividades")
        }
      }
    }
    cargarActividades()
  }, [user?.token])

  const agregarPregunta = () => {
    setPreguntas([...preguntas, {
      pregunta: '',
      opciones: [{ texto: '', esCorrecta: false }]
    }])
  }

  const eliminarPregunta = (preguntaIndex) => {
    setPreguntas(preguntas.filter((_, index) => index !== preguntaIndex))
  }

  const actualizarPregunta = (preguntaIndex, campo, valor) => {
    const nuevasPreguntas = preguntas.map((pregunta, index) => {
      if (index === preguntaIndex) {
        return { ...pregunta, [campo]: valor }
      }
      return pregunta
    })
    setPreguntas(nuevasPreguntas)
  }

  const agregarOpcion = (preguntaIndex) => {
    const nuevasPreguntas = preguntas.map((pregunta, index) => {
      if (index === preguntaIndex) {
        return {
          ...pregunta,
          opciones: [...pregunta.opciones, { texto: '', esCorrecta: false }]
        }
      }
      return pregunta
    })
    setPreguntas(nuevasPreguntas)
  }

  const eliminarOpcion = (preguntaIndex, opcionIndex) => {
    const nuevasPreguntas = preguntas.map((pregunta, index) => {
      if (index === preguntaIndex) {
        return {
          ...pregunta,
          opciones: pregunta.opciones.filter((_, i) => i !== opcionIndex)
        }
      }
      return pregunta
    })
    setPreguntas(nuevasPreguntas)
  }

  const validarPregunta = (pregunta) => {
    if (!pregunta.pregunta?.trim()) {
      setMensaje("La pregunta es obligatoria")
      return false
    }

    if (!pregunta.opciones?.length) {
      setMensaje("Debe proporcionar al menos una opción")
      return false
    }

    for (const opcion of pregunta.opciones) {
      if (!opcion.texto?.trim()) {
        setMensaje("El texto de la opción es obligatorio")
        return false
      }
    }

    const tieneOpcionCorrecta = pregunta.opciones.some(opcion => opcion.esCorrecta)
    if (!tieneOpcionCorrecta) {
      setMensaje("Debe marcar al menos una opción como correcta")
      return false
    }

    return true
  }

  const validarFormulario = () => {
    // Validación del título
    if (!titulo.trim()) {
      setMensaje("El título es obligatorio")
      return false
    }

    // Validación de fecha límite
    if (!fechaLimite) {
      setMensaje("La fecha límite es obligatoria")
      return false
    }

    // Validación de preguntas
    if (!preguntas || preguntas.length === 0) {
      setMensaje("Debe proporcionar al menos una pregunta")
      return false
    }

    // Validar cada pregunta
    for (const pregunta of preguntas) {
      // Validar texto de la pregunta
      if (!pregunta.pregunta.trim()) {
        setMensaje("Cada pregunta debe tener un texto")
        return false
      }

      // Validar opciones
      if (!pregunta.opciones || pregunta.opciones.length < 2) {
        setMensaje("Cada pregunta debe tener al menos dos opciones")
        return false
      }

      // Validar que las opciones tengan texto
      const opcionesValidas = pregunta.opciones.filter(o => o.texto.trim())
      if (opcionesValidas.length < 2) {
        setMensaje("Cada pregunta debe tener al menos dos opciones con texto")
        return false
      }

      // Verificar que haya al menos una respuesta correcta
      const opcionesCorrectas = pregunta.opciones.filter(o => o.esCorrecta)
      if (opcionesCorrectas.length < 1) {
        setMensaje("Cada pregunta debe tener al menos una opción correcta")
        return false
      }
    }

    return true
  }


  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      let nuevaActividad = {
        titulo,
        descripcion,
        fechaLimite,
        tipo
      }
      if (tipo === 'archivo') {
        if (archivo) {
          nuevaActividad.archivo = archivo
        } else if (archivoUrl) {
          nuevaActividad.archivoUrl = archivoUrl
        } else {
          setMensaje('Debes subir un archivo o ingresar una URL')
          return
        }
      } else if (tipo === 'formulario') {
        nuevaActividad.preguntas = preguntas
      }
      await crearActividad(nuevaActividad)
      setMensaje('Actividad creada correctamente')
      setTitulo("")
      setDescripcion("")
      setFechaLimite("")
      setArchivo(null)
      setArchivoUrl("")
      setPreguntas([{ pregunta: '', opciones: [{ texto: '', esCorrecta: false }] }])
      setTipo('formulario')
    } catch (error) {
      setMensaje(error.response?.data?.error || 'Error al crear actividad')
    }
    setTimeout(() => setMensaje(null), 3000)
  }

  // Modificar la función actualizarOpcion
  const actualizarOpcion = (preguntaIndex, opcionIndex, campo, valor) => {
    const nuevasPreguntas = preguntas.map((pregunta, pIndex) => {
      if (pIndex === preguntaIndex) {
        const nuevasOpciones = pregunta.opciones.map((opcion, oIndex) => {
          if (oIndex === opcionIndex) {
            return { ...opcion, [campo]: valor }
          }
          return opcion
        })
        return { ...pregunta, opciones: nuevasOpciones }
      }
      return pregunta
    })
    setPreguntas(nuevasPreguntas)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f6f8fa' }}>
      <Menu user={user} />
      <div style={{ maxWidth: 600, margin: '0 auto', background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.08)', padding: '2.5rem 2rem', marginTop: 32 }}>
  <h2 style={{ textAlign: 'center', color: '#e94560', fontWeight: 800, marginBottom: 24 }}>Crear Actividad</h2>
  {mensaje && <div style={{ color: mensaje.includes('Error') ? 'red' : 'green', marginBottom: 16 }}>{mensaje}</div>}
        <form onSubmit={handleSubmit} encType={tipo === 'archivo' ? 'multipart/form-data' : undefined}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontWeight: 600 }}>Tipo de actividad:</label>
            <select value={tipo} onChange={e => setTipo(e.target.value)} style={{ marginLeft: 8 }}>
              <option value="formulario">Formulario</option>
              <option value="archivo">Archivo</option>
            </select>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontWeight: 600 }}>Título:</label>
            <input type="text" value={titulo} onChange={e => setTitulo(e.target.value)} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ddd' }} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontWeight: 600 }}>Descripción:</label>
            <input type="text" value={descripcion} onChange={e => setDescripcion(e.target.value)} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ddd' }} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontWeight: 600 }}>Fecha límite:</label>
            <input type="date" value={fechaLimite} onChange={e => setFechaLimite(e.target.value)} required style={{ padding: 8, borderRadius: 6, border: '1px solid #ddd' }} />
          </div>
          {tipo === 'archivo' && (
            <>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontWeight: 600 }}>Subir archivo:</label>
                <input type="file" onChange={e => setArchivo(e.target.files[0])} style={{ marginLeft: 8 }} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontWeight: 600 }}>o URL de archivo:</label>
                <input type="text" value={archivoUrl} onChange={e => setArchivoUrl(e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ddd' }} />
              </div>
            </>
          )}
          {tipo === 'formulario' && (
            <div style={{ marginBottom: 16 }}>
              <h4 style={{ color: '#1a2238', fontWeight: 700 }}>Preguntas</h4>
              {preguntas.map((pregunta, preguntaIndex) => (
                <div key={preguntaIndex} style={{ marginBottom: 16, background: '#f6f8fa', borderRadius: 8, padding: 12 }}>
                  <input
                    type="text"
                    placeholder="Pregunta"
                    value={pregunta.pregunta}
                    onChange={e => actualizarPregunta(preguntaIndex, 'pregunta', e.target.value)}
                    style={{ width: '100%', marginBottom: 8, padding: 6, borderRadius: 4, border: '1px solid #ccc' }}
                  />
                  <button type="button" onClick={() => eliminarPregunta(preguntaIndex)} style={{ color: '#e94560', background: 'none', border: 'none', cursor: 'pointer', float: 'right' }}>Eliminar</button>
                  <div style={{ marginTop: 8 }}>
                    Opciones:
                    {pregunta.opciones.map((opcion, opcionIndex) => (
                      <div key={opcionIndex} style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                        <input
                          type="text"
                          placeholder="Opción"
                          value={opcion.texto}
                          onChange={e => {
                            const nuevasPreguntas = preguntas.map((p, i) => {
                              if (i === preguntaIndex) {
                                const nuevasOpciones = p.opciones.map((o, j) => j === opcionIndex ? { ...o, texto: e.target.value } : o)
                                return { ...p, opciones: nuevasOpciones }
                              }
                              return p
                            })
                            setPreguntas(nuevasPreguntas)
                          }}
                          style={{ flex: 1, marginRight: 8, padding: 4, borderRadius: 4, border: '1px solid #ccc' }}
                        />
                        <label style={{ marginRight: 8 }}>
                          <input
                            type="checkbox"
                            checked={opcion.esCorrecta}
                            onChange={e => {
                              const nuevasPreguntas = preguntas.map((p, i) => {
                                if (i === preguntaIndex) {
                                  const nuevasOpciones = p.opciones.map((o, j) => ({ ...o, esCorrecta: j === opcionIndex ? e.target.checked : false }))
                                  return { ...p, opciones: nuevasOpciones }
                                }
                                return p
                              })
                              setPreguntas(nuevasPreguntas)
                            }}
                          /> Correcta
                        </label>
                        <button type="button" onClick={() => eliminarOpcion(preguntaIndex, opcionIndex)} style={{ color: '#e94560', background: 'none', border: 'none', cursor: 'pointer' }}>Eliminar opción</button>
                      </div>
                    ))}
                    <button type="button" onClick={() => agregarOpcion(preguntaIndex)} style={{ marginTop: 4, color: '#1a2238', background: '#eaeaea', border: 'none', borderRadius: 4, padding: '4px 12px', cursor: 'pointer' }}>Agregar opción</button>
                  </div>
                </div>
              ))}
              <button type="button" onClick={agregarPregunta} style={{ color: '#fff', background: '#e94560', border: 'none', borderRadius: 6, padding: '8px 16px', fontWeight: 600, marginTop: 8 }}>Agregar pregunta</button>
            </div>
          )}
          <button type="submit" style={{ width: '100%', background: '#e94560', color: '#fff', padding: '12px', border: 'none', borderRadius: 6, fontWeight: 700, fontSize: '1rem', marginTop: 16 }}>Crear actividad</button>
        </form>
      </div>
      <div style={{ maxWidth: 600, margin: '2rem auto', background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.08)', padding: '2rem' }}>
        <h3 style={{ color: '#1a2238', fontWeight: 700 }}>Mis Actividades</h3>
        {errorActividades ? (
          <p style={{ color: 'red' }}>{errorActividades}</p>
        ) : actividades.length === 0 ? (
          <p>No hay actividades disponibles</p>
        ) : (
          <ul>
            {actividades.map(actividad => (
              <li key={actividad.id} style={{ marginBottom: 16, borderBottom: '1px solid #eee', paddingBottom: 8 }}>
                <h4 style={{ margin: 0 }}>{actividad.titulo}</h4>
                <p style={{ margin: 0 }}>{actividad.descripcion}</p>
                <p style={{ margin: 0 }}>Fecha límite: {actividad.fechaLimite ? new Date(actividad.fechaLimite).toLocaleDateString() : 'Sin fecha'}</p>
                <p style={{ margin: 0 }}>Tipo: {actividad.tipo}</p>
                <p style={{ margin: 0 }}>Creado por: {actividad.nombreCreador || 'N/A'}</p>
                {actividad.archivoUrl && <a href={actividad.archivoUrl} target="_blank" rel="noopener noreferrer">Ver archivo</a>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default Actividades
