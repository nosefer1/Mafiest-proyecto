import React, { useState, useEffect } from 'react'
import asesoriasService from '../services/asesorias'
import { useNavigate } from 'react-router-dom'

const VerAsesorias = () => {
  const [asesorias, setAsesorias] = useState([])
  const navigate = useNavigate()
  const user = JSON.parse(window.localStorage.getItem('loggedUser'))

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    
    const fetchAsesorias = async () => {
      try {
        const data = await asesoriasService.getByUser(user.id)
        setAsesorias(data)
      } catch (error) {
        console.error('Error al cargar asesorías:', error)
      }
    }

    fetchAsesorias()
  }, [user, navigate])

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Mis Asesorías</h1>
      <div className="grid gap-4">
        {asesorias.map(asesoria => (
          <div key={asesoria.id} className="border p-4 rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold">Fecha: {new Date(asesoria.createdAt).toLocaleDateString()}</p>
                {asesoria.profesorAsignado && (
                  <p className="text-gray-600">Profesor: {asesoria.profesorAsignado}</p>
                )}
              </div>
              <div className="text-right">
                <span className={`px-2 py-1 rounded-full text-sm ${
                  asesoria.estado === 'respondida' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {asesoria.estado}
                </span>
              </div>
            </div>
            
            <div className="mt-3">
              <p className="font-medium">Consulta:</p>
              <p className="text-gray-700">{asesoria.message}</p>
            </div>

            {asesoria.respuesta && (
              <div className="mt-3 bg-gray-50 p-3 rounded">
                <p className="font-medium">Respuesta:</p>
                <p className="text-gray-700">{asesoria.respuesta}</p>
              </div>
            )}

            {asesoria.precio && asesoria.estado === 'respondida' && (
              <div className="mt-3 border-t pt-3">
                <p className="font-semibold text-blue-600">
                  Precio asesoría presencial: ${asesoria.precio}
                </p>
              </div>
            )}
          </div>
        ))}
        {asesorias.length === 0 && (
          <p className="text-center text-gray-500">No tienes asesorías registradas</p>
        )}
      </div>
    </div>
  )
}

export default VerAsesorias