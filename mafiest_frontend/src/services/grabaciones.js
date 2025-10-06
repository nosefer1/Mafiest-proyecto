import axios from 'axios'
const baseUrl = '/api/grabaciones'


const crearGrabacion = async (nuevaGrabacion) => {
  const response = await axios.post(baseUrl, nuevaGrabacion)
  return response.data
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const eliminarGrabacion = async (id) => {
  const response = await axios.delete(`${baseUrl}/${id}`)
  return response.data
}

const editarGrabacion = async (id, data) => {
  const response = await axios.put(`${baseUrl}/${id}`, data)
  return response.data
}

export { crearGrabacion, getAll, eliminarGrabacion, editarGrabacion }
