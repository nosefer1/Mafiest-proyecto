const express = require('express');
const router = express.Router();
const Asesoria = require('../models/asesoria');
const { User } = require('../models');

// Crear una nueva asesoría
router.post('/', async (req, res) => {
  try {
    const { userId, message } = req.body;
    const asesoria = await Asesoria.create({ userId, message });
    res.status(201).json(asesoria);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Obtener todas las asesorías (solo admin/docente)
router.get('/', async (req, res) => {
  try {
    const asesorias = await Asesoria.findAll({ include: [{ model: User, as: 'user' }] });
    res.json(asesorias);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
