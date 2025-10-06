import axios from 'axios'
import { BASE_URL } from './config'

const baseUrl = `${BASE_URL}/respuestas-actividad`

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const subirRespuestaArchivo = async (actividadId, archivo, archivoUrl) => {
  const config = { headers: { Authorization: token } }
  const formData = new FormData()
  if (archivo) formData.append('archivo', archivo)
  if (archivoUrl) formData.append('archivoUrl', archivoUrl)
  const response = await axios.post(`${baseUrl}/actividad/${actividadId}`, formData, config)
  return response.data
}

const eliminarRespuesta = async (respuestaId) => {
  const config = { headers: { Authorization: token } }
  const response = await axios.delete(`${baseUrl}/${respuestaId}`, config)
  return response.data
}

const obtenerRespuestasActividad = async (actividadId) => {
  const response = await axios.get(`${baseUrl}/actividad/${actividadId}`)
  return response.data
}

const setRetroalimentacion = async (respuestaId, retroalimentacion, nota) => {
  const config = { headers: { Authorization: token } }
  const response = await axios.put(
    `${baseUrl}/retroalimentacion/${respuestaId}`,
    { retroalimentacion, nota },
    config
  )
  return response.data
}

export default {
  setToken,
  subirRespuestaArchivo,
  eliminarRespuesta,
  obtenerRespuestasActividad,
  setRetroalimentacion
}
