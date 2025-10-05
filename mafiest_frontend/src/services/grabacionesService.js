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

export default { crearGrabacion, getAll }
