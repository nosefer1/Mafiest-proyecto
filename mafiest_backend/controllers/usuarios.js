// Controlador para usuarios
const User = require('../models/user')

const crearUsuario = async (req, res) => {
  try {
    const user = new User(req.body)
    const saved = await user.save()
    res.status(201).json(saved)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

const obtenerUsuarios = async (req, res) => {
  try {
    const users = await User.find({})
    res.json(users)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

module.exports = { crearUsuario, obtenerUsuarios }
