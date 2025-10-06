import axios from 'axios'
import { BASE_URL } from './config'

const baseUrl = `${BASE_URL}/actividades`

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const obtenerTodas = async () => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.get(baseUrl, config)
  return response.data
}

const obtenerPorId = async (id) => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.get(`${baseUrl}/${id}`, config)
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

const actualizarActividad = async (id, updatedObject) => {
  const config = {
    headers: { Authorization: token }
  }
  let dataToSend = updatedObject

  if (updatedObject.tipo === 'archivo' && (updatedObject.archivo || updatedObject.archivoUrl)) {
    const formData = new FormData()
    formData.append('titulo', updatedObject.titulo)
    formData.append('descripcion', updatedObject.descripcion)
    formData.append('fechaLimite', updatedObject.fechaLimite)
    formData.append('tipo', 'archivo')
    if (updatedObject.archivo) formData.append('archivo', updatedObject.archivo)
    if (updatedObject.archivoUrl) formData.append('archivoUrl', updatedObject.archivoUrl)
    dataToSend = formData
    config.headers['Content-Type'] = 'multipart/form-data'
  } else if (updatedObject.tipo === 'formulario') {
    if (Array.isArray(updatedObject.preguntas)) {
      updatedObject.preguntas = JSON.stringify(updatedObject.preguntas)
    }
  }

  const response = await axios.put(`${baseUrl}/${id}`, dataToSend, config)
  return response.data
}

const eliminarActividad = async (id) => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.delete(`${baseUrl}/${id}`, config)
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

export default {
  setToken,
  obtenerTodas,
  obtenerPorId,
  obtenerMisActividades,
  crearActividad,
  actualizarActividad,
  eliminarActividad,
  responderActividad
}