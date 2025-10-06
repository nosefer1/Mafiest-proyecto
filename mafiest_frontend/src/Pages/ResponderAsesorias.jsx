import React, { useState, useEffect } from 'react'
import asesoriasService from '../services/asesorias'
import { useNavigate } from 'react-router-dom'

const ResponderAsesorias = () => {
  const [asesorias, setAsesorias] = useState([])
  const [mensaje, setMensaje] = useState('')
  const navigate = useNavigate()
  const user = JSON.parse(window.localStorage.getItem('loggedUser'))

  useEffect(() => {
    if (!user || user.rol !== 'administrador') {
      navigate('/login')
      return
    }
    
    const fetchAsesorias = async () => {
      try {
        // Obtener todas las asesorías (el admin puede ver todas)
        const data = await asesoriasService.getAll()
        setAsesorias(data)
      } catch (error) {
        setMensaje('Error al cargar asesorías')
        console.error('Error:', error)
      }
    }

    fetchAsesorias()
  }, [user, navigate])

  const handleResponder = async (id, respuesta) => {
    try {
      const asesoria = {
        profesorAsignado: respuesta.profesor,
        precio: respuesta.precio,
        respuesta: respuesta.mensaje,
        estado: 'respondida'
      }
      
      await asesoriasService.update(id, asesoria)
      
      // Actualizar la lista de asesorías
      const updatedAsesorias = asesorias.map(a => 
        a.id === id 
          ? { ...a, ...asesoria }
          : a
      )
      setAsesorias(updatedAsesorias)
      setMensaje('Asesoría respondida exitosamente')
    } catch (error) {
      setMensaje('Error al responder la asesoría')
      console.error('Error:', error)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gestión de Asesorías</h1>
      
      {mensaje && (
        <div className="mb-4 p-3 bg-blue-100 text-blue-700 rounded">
          {mensaje}
        </div>
      )}

      <div className="grid gap-6">
        {asesorias.map(asesoria => (
          <div key={asesoria.id} className="border rounded-lg p-4 shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-gray-600">
                  Fecha: {new Date(asesoria.createdAt).toLocaleDateString()}
                </p>
                <p className="text-gray-600">
                  Usuario ID: {asesoria.userId}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${
                asesoria.estado === 'respondida' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {asesoria.estado}
              </span>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold">Consulta:</h3>
              <p className="text-gray-700">{asesoria.message}</p>
            </div>

            {asesoria.estado === 'respondida' ? (
              <div className="bg-gray-50 p-3 rounded">
                <h3 className="font-semibold">Respuesta:</h3>
                <p className="text-gray-700">{asesoria.respuesta}</p>
                <p className="mt-2 text-blue-600">
                  Profesor asignado: {asesoria.profesorAsignado}
                </p>
                <p className="text-blue-600">
                  Precio asesoría: ${asesoria.precio}
                </p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  const formData = new FormData(e.target)
                  handleResponder(asesoria.id, {
                    profesor: formData.get('profesor'),
                    precio: formData.get('precio'),
                    mensaje: formData.get('mensaje')
                  })
                }}
                className="bg-gray-50 p-3 rounded"
              >
                <div className="grid gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Profesor asignado:
                    </label>
                    <input
                      type="text"
                      name="profesor"
                      required
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Precio asesoría presencial:
                    </label>
                    <input
                      type="number"
                      name="precio"
                      step="0.01"
                      required
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Respuesta:
                    </label>
                    <textarea
                      name="mensaje"
                      required
                      rows="4"
                      className="w-full p-2 border rounded"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Enviar Respuesta
                  </button>
                </div>
              </form>
            )}
          </div>
        ))}

        {asesorias.length === 0 && (
          <p className="text-center text-gray-500">
            No hay asesorías pendientes
          </p>
        )}
      </div>
    </div>
  )
}

export default ResponderAsesorias