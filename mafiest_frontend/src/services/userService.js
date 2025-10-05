const updateUser = async (id, userData) => {
  const response = await axios.patch(`${baseUrl}/${id}`, userData)
  return response.data
}
// src/services/userService.js
import axios from 'axios'
import { BASE_URL } from './config'

const baseUrl = `${BASE_URL}/users`

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const createUser = async userData => {
  // Permite crear usuario tanto para registro independiente como para admin
  const response = await axios.post(baseUrl, userData)
  return response.data
}
// Alias para compatibilidad con código antiguo
const crearUsuario = createUser;

// Alias para compatibilidad con código antiguo
const getAllUsuarios = getAll;

const getMakers = async () => {
  const response = await axios.get(`${baseUrl}/makers`)
  return response.data
}

const deleteUser = async (id) => {
  const response = await axios.delete(`${baseUrl}/${id}`)
  return response.data
}

export default {
  getAll,
  createUser,
  crearUsuario,
  getAllUsuarios,
  getMakers,
  deleteUser,
  updateUser
}