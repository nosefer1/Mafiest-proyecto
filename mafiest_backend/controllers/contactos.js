const express = require('express')
const router = express.Router()
const { Contacto } = require('../models')

// Obtener todos los contactos
router.get('/', async (req, res) => {
  try {
    const contactos = await Contacto.findAll({ order: [['createdAt', 'DESC']] })
    res.json(contactos)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener contactos', details: error.message })
  }
})

// Obtener contacto por id
router.get('/:id', async (req, res) => {
  try {
    const contacto = await Contacto.findByPk(req.params.id)
    if (contacto) {
      res.json(contacto)
    } else {
      res.status(404).json({ error: 'Contacto no encontrado' })
    }
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Crear contacto
router.post('/', async (req, res) => {
  try {
    const { username, name, number, email, comments } = req.body
    if (!username || !name || !number || !email) {
      return res.status(400).json({ error: 'username, name, number y email son requeridos' })
    }
    const existing = await Contacto.findOne({ where: { email } })
    if (existing) {
      return res.status(400).json({ error: 'Este correo electrónico ya está registrado' })
    }
    const contacto = await Contacto.create({
      username,
      name,
      number,
      email,
      comments: comments || '',
      createdAt: new Date()
    })
    res.status(201).json(contacto)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
