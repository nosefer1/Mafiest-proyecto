const express = require('express')
const Actividad = require('../models/actividad')
const User = require('../models/user')
const { userExtractor, permitRoles } = require('../utils/middleware')
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })
const actividadesRouter = express.Router()

// GET actividades según rol
actividadesRouter.get('/mis-actividades', userExtractor, async (req, res) => {
  try {
    const usuario = req.user
    let actividades = []
    if (usuario.rol === 'docente') {
      actividades = await Actividad.findAll({
        where: { creadorId: usuario.id },
        include: [{ model: User, as: 'autor', attributes: ['username', 'name', 'rol'] }],
        raw: false
      })
    } else if (usuario.rol === 'administrador') {
      actividades = await Actividad.findAll({
        include: [{ model: User, as: 'autor', attributes: ['username', 'name', 'rol'] }],
        raw: false
      })
    } else if (usuario.rol === 'estudiante') {
      actividades = await Actividad.findAll({
        where: {
          [Actividad.sequelize.Op.or]: [
            { global: true },
            { '$autor.rol$': 'docente', '$autor.grupoId$': usuario.grupoId }
          ]
        },
        include: [{ model: User, as: 'autor', attributes: ['username', 'name', 'rol', 'grupoId'] }],
        order: [['fechaLimite', 'ASC']],
        raw: false
      })
    } else if (usuario.rol === 'independiente') {
      actividades = await Actividad.findAll({
        where: { global: true },
        include: [{ model: User, as: 'autor', attributes: ['username', 'name', 'rol'] }],
        order: [['fechaLimite', 'ASC']],
        raw: false
      })
    }
    res.json(actividades)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las tareas', details: error.message })
  }
})

// GET todas las actividades
actividadesRouter.get('/', async (req, res) => {
  try {
    const actividades = await Actividad.findAll({
      include: [{ model: User, as: 'autor', attributes: ['username', 'name', 'rol'] }],
      raw: false
    })
    res.json(actividades)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las tareas', details: error.message })
  }
})

// POST crear actividad
actividadesRouter.post('/', userExtractor, permitRoles('docente', 'administrador'), upload.single('archivo'), async (req, res) => {
  try {
    const user = req.user
    const { titulo, descripcion, fechaLimite, tipo, preguntas, archivoUrl } = req.body
    let actividadData = {
      titulo,
      descripcion,
      fechaLimite: new Date(fechaLimite),
      tipo,
      creadorId: user.id,
      global: user.rol === 'administrador'
    }
    if (tipo === 'archivo') {
      if (req.file) {
        actividadData.archivoUrl = `/uploads/${req.file.filename}`
      } else if (archivoUrl) {
        actividadData.archivoUrl = archivoUrl
      } else {
        return res.status(400).json({ error: 'Debe subir un archivo o proporcionar una URL' })
      }
    } else if (tipo === 'formulario') {
      let parsedPreguntas = preguntas
      if (typeof preguntas === 'string') {
        parsedPreguntas = JSON.parse(preguntas)
      }
      if (!parsedPreguntas || !Array.isArray(parsedPreguntas) || parsedPreguntas.length === 0) {
        return res.status(400).json({ error: 'Debe proporcionar al menos una pregunta' })
      }
      for (const pregunta of parsedPreguntas) {
        if (!pregunta.pregunta) {
          return res.status(400).json({ error: 'Cada pregunta debe tener un texto' })
        }
        if (!pregunta.opciones || !Array.isArray(pregunta.opciones) || pregunta.opciones.length === 0) {
          return res.status(400).json({ error: 'Cada pregunta debe tener al menos una opción' })
        }
        const opcionesCorrectas = pregunta.opciones.filter(opcion => opcion.esCorrecta)
        if (opcionesCorrectas.length !== 1) {
          return res.status(400).json({ error: 'Cada pregunta debe tener exactamente una opción correcta' })
        }
      }
      actividadData.preguntas = parsedPreguntas
    } else {
      return res.status(400).json({ error: 'Tipo de actividad inválido' })
    }
    const nuevaActividad = await Actividad.create(actividadData)
    const actividadConUsuario = await Actividad.findOne({
      where: { id: nuevaActividad.id },
      include: [{ model: User, as: 'autor', attributes: ['username', 'name', 'rol'] }]
    })
    res.status(201).json(actividadConUsuario)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// POST responder pregunta
actividadesRouter.post('/:id/responder', userExtractor, permitRoles('estudiante'), async (req, res) => {
  try {
    const { preguntaIndex, respuestaIndex } = req.body
    const user = req.user
    const actividad = await Actividad.findOne({ where: { id: req.params.id } })
    if (!actividad) {
      return res.status(404).json({ error: 'Actividad no encontrada' })
    }
    let preguntas = actividad.preguntas || []
    if (typeof preguntas === 'string') {
      preguntas = JSON.parse(preguntas)
    }
    if (preguntaIndex < 0 || preguntaIndex >= preguntas.length) {
      return res.status(400).json({ error: 'Índice de pregunta inválido' })
    }
    if (respuestaIndex < 0 || respuestaIndex >= preguntas[preguntaIndex].opciones.length) {
      return res.status(400).json({ error: 'Índice de respuesta inválido' })
    }
    if (!preguntas[preguntaIndex].respuestas) {
      preguntas[preguntaIndex].respuestas = []
    }
    const respuestaExistente = preguntas[preguntaIndex].respuestas.findIndex(r => r.usuarioId === user.id)
    const nuevaRespuesta = {
      usuarioId: user.id,
      seleccion: respuestaIndex,
      timestamp: new Date()
    }
    if (respuestaExistente >= 0) {
      preguntas[preguntaIndex].respuestas[respuestaExistente] = nuevaRespuesta
    } else {
      preguntas[preguntaIndex].respuestas.push(nuevaRespuesta)
    }
    const todasRespondidas = preguntas.every(pregunta => pregunta.respuestas?.some(r => r.usuarioId === user.id))
    await actividad.update({ preguntas: preguntas, completada: todasRespondidas })
    const actividadActualizada = await Actividad.findOne({
      where: { id: actividad.id },
      include: [{ model: User, as: 'autor', attributes: ['username', 'name', 'rol'] }]
    })
    res.json(actividadActualizada)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = actividadesRouter
