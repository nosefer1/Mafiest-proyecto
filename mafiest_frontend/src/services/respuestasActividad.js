import axios from 'axios'
import { BASE_URL } from './config'

const baseUrl = `${BASE_URL}/respuestas-actividad`

let token = null
export const setToken = newToken => { token = `Bearer ${newToken}` }

export const subirRespuestaArchivo = async (actividadId, archivo, archivoUrl) => {
  const config = { headers: { Authorization: token } }
  const formData = new FormData()
  if (archivo) formData.append('archivo', archivo)
  if (archivoUrl) formData.append('archivoUrl', archivoUrl)
  return (await axios.post(`${baseUrl}/actividad/${actividadId}`, formData, config)).data
}

export const eliminarRespuesta = async (respuestaId) => {
  const config = { headers: { Authorization: token } }
  return (await axios.delete(`${baseUrl}/${respuestaId}`, config)).data
}

export const obtenerRespuestasActividad = async (actividadId) => {
  return (await axios.get(`${baseUrl}/actividad/${actividadId}`)).data
}

export const setRetroalimentacion = async (respuestaId, retroalimentacion, nota) => {
  const config = { headers: { Authorization: token } }
  return (await axios.put(`${baseUrl}/retroalimentacion/${respuestaId}`, { retroalimentacion, nota }, config)).data
}
