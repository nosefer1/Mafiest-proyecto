import axios from 'axios'
import { BASE_URL } from './config'

const baseUrl = `${BASE_URL}/actividades`

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const obtenerTodas = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const obtenerMisActividades = async () => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.get(`${baseUrl}/mis-actividades`, config)
  return response.data
}

const crearActividad = async newObject => {
  const config = {
    headers: { Authorization: token }
  }
  let dataToSend = newObject
  // Si es archivo, usar FormData
  if (newObject.tipo === 'archivo' && (newObject.archivo || newObject.archivoUrl)) {
    const formData = new FormData()
    formData.append('titulo', newObject.titulo)
    formData.append('descripcion', newObject.descripcion)
    formData.append('fechaLimite', newObject.fechaLimite)
    formData.append('tipo', 'archivo')
    if (newObject.archivo) formData.append('archivo', newObject.archivo)
    if (newObject.archivoUrl) formData.append('archivoUrl', newObject.archivoUrl)
    dataToSend = formData
    config.headers['Content-Type'] = 'multipart/form-data'
  } else if (newObject.tipo === 'formulario') {
    // Enviar preguntas como string si es necesario
    if (Array.isArray(newObject.preguntas)) {
      newObject.preguntas = JSON.stringify(newObject.preguntas)
    }
  }
  const response = await axios.post(baseUrl, dataToSend, config)
  return response.data
}

const responderActividad = async (id, preguntaIndex, respuestaIndex) => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.post(`${baseUrl}/${id}/responder`, {
    preguntaIndex,
    respuestaIndex
  }, config)
  return response.data
}

const eliminarActividad = async (id) => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.delete(`${baseUrl}/${id}`, config)
  return response.data
}

const editarActividad = async (id, data) => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.put(`${baseUrl}/${id}`, data, config)
  return response.data
}

export {
  obtenerTodas,
  obtenerMisActividades,
  crearActividad,
  responderActividad,
  eliminarActividad,
  editarActividad,
  setToken
}