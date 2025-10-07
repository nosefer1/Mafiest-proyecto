import { useEffect, useState } from "react"
import * as userService from "../services/user"
import Menu from "../components/Menu"

const ListaUsuarios = ({ user }) => {
  const [usuarios, setUsuarios] = useState([])
  const [message, setMessage] = useState(null)

  const fetchUsers = async () => {
    const datos = await userService.getAll()
    setUsuarios(datos)
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleDelete = async (id, username) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar al usuario ${username}?`)) {
      try {
        await userService.deleteUser(id)
        setMessage(`✅ Usuario ${username} eliminado correctamente`)
        // Actualizar la lista de usuarios
        fetchUsers()
      } catch (error) {
        console.error(error)
        setMessage(`❌ Error al eliminar el usuario: ${error.response?.data?.error || error.message}`)
      }
      setTimeout(() => setMessage(null), 4000)
    }
  }

  return (
    <div>
      <h2>Usuarios Registrados</h2>
      {message && <p className="message">{message}</p>}
      {usuarios.length === 0
        ? <p>No hay usuarios aún.</p>
        : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {usuarios.map(u => (
              <li key={u.id} className="card mb-3">
                <div>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <strong className="me-3">Usuario: {u.username}</strong>
                    <span className={`badge ${u.Rol === 'administrador' ? 'bg-danger' : 
                      u.Rol === 'docente' ? 'bg-success' : 
                      u.Rol === 'estudiante' ? 'bg-primary' : 'bg-secondary'}`}>
                      {u.Rol || "Sin rol"}
                    </span>
                  </div>
                  <div className="mb-1">Nombre: {u.name}</div>
                  <div className="mb-1">Correo: {u.email}</div>
                  <div className="mb-1">
                    Grupo: {u.grupoId ? (
                      <span className="badge bg-info">{u.grupoId}</span>
                    ) : (
                      <small className="text-muted">No asignado</small>
                    )}
                  </div>
                </div>
                {/* No mostrar el botón de eliminar para el usuario actual */}
                {user?.username !== u.username && (
                  <button 
                    onClick={() => handleDelete(u.id, u.username)}
                    className="btn btn-danger btn-sm"
                  >
                    Eliminar
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
    </div>
  )
}

export default ListaUsuarios