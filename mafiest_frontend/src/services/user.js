// src/services/userService.js
import axios from 'axios'
import { BASE_URL } from './config'

const baseUrl = `${BASE_URL}/users`

// Obtener todos los usuarios
const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

// Crear usuario (registro independiente o administrador)
const createUser = async (userData) => {
  const response = await axios.post(baseUrl, userData)
  return response.data
}

// Actualizar usuario
const updateUser = async (id, userData) => {
  const response = await axios.patch(`${baseUrl}/${id}`, userData)
  return response.data
}

// Eliminar usuario
const deleteUser = async (id) => {
  const response = await axios.delete(`${baseUrl}/${id}`)
  return response.data
}

// Obtener "makers" (por ejemplo, docentes o roles específicos)
const getMakers = async () => {
  const response = await axios.get(`${baseUrl}/makers`)
  return response.data
}

// Alias de compatibilidad (para mantener compatibilidad con código antiguo)
const crearUsuario = createUser
const getAllUsuarios = getAll

// Exportación unificada
export default {
  getAll,
  createUser,
  crearUsuario,
  getAllUsuarios,
  getMakers,
  deleteUser,
  updateUser
  }
