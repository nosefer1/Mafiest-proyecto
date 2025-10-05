import { useState } from 'react'
import grabacionesService from '../services/grabacionesService'

const AgregarGrabacion = ({ user, onGrabacionAgregada }) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [driveLink, setDriveLink] = useState('')
  const [grupoId, setGrupoId] = useState('')
  const [mensaje, setMensaje] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      let tipo = 'general';
      let data = { title, description, driveLink };
      if (user.rol === 'administrador') {
        tipo = 'general';
      } else if (user.rol === 'docente') {
        tipo = grupoId ? 'grupal' : 'general';
        if (tipo === 'grupal') data.grupoId = grupoId;
      }
      data.tipo = tipo;
      await grabacionesService.crearGrabacion(data)
      setMensaje('Grabación agregada correctamente')
      setTitle('')
      setDescription('')
      setDriveLink('')
      setGrupoId('')
      if (onGrabacionAgregada) onGrabacionAgregada()
    } catch (error) {
      setMensaje(error.response?.data?.error || 'Error al agregar grabación')
    }
    setTimeout(() => setMensaje(null), 3000)
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
      <h3>Agregar Grabación</h3>
      <input
        type="text"
        placeholder="Título"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Descripción"
        value={description}
        onChange={e => setDescription(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Enlace de Drive"
        value={driveLink}
        onChange={e => setDriveLink(e.target.value)}
        required
      />
      {user.rol === 'docente' && (
        <input
          type="number"
          placeholder="Grupo ID"
          value={grupoId}
          onChange={e => setGrupoId(e.target.value)}
        />
      )}
      <button type="submit" style={{ marginLeft: 8, fontSize: 20 }}>+</button>
      {mensaje && <div style={{ color: 'green', marginTop: 8 }}>{mensaje}</div>}
    </form>
  )
}

export default AgregarGrabacion
