import { useEffect, useState } from 'react'
import grabacionesService from '../services/grabacionesService'
import Menu from '../components/Menu'

const VerGrabaciones = ({ user }) => {
  const [grabaciones, setGrabaciones] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const cargar = async () => {
      try {
        setLoading(true)
        const data = await grabacionesService.getAll()
        setGrabaciones(data)
        setError(null)
      } catch (err) {
        setError('No se pudieron cargar las grabaciones')
      } finally {
        setLoading(false)
      }
    }
    cargar()
  }, [])

  return (
    <div style={{ padding: 24 }}>
      <Menu user={user} />
      <h2>Ver Grabaciones</h2>
      {loading ? (
        <div>Cargando...</div>
      ) : error ? (
        <div style={{ color: 'red' }}>{error}</div>
      ) : (
        <ul>
          {grabaciones.map(g => (
            <li key={g.id}>
              <a href={g.driveLink} target="_blank" rel="noopener noreferrer">{g.title}</a> - {g.description}
              {g.grupoId ? ` (Grupo ${g.grupoId})` : ' (General)'}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default VerGrabaciones
