const express = require('express')
const Actividad = require('../models/actividad')
const User = require('../models/user')
const actividadesRouter = express.Router()
const { userExtractor, permitRoles } = require('../utils/middleware')

// Modificar el GET para filtrar por roles
actividadesRouter.get('/mis-actividades', userExtractor, async (req, res) => {
  try {
    const usuario = req.user

    let actividades = []
    if (usuario.rol === 'docente') {
      actividades = await Actividad.findAll({
        where: { creadorId: usuario.id },
        include: [{
          model: User,
          as: 'autor',
          attributes: ['username', 'name', 'rol']
        }],
        raw: false
      })
    } else if (usuario.rol === 'estudiante') {
      actividades = await Actividad.findAll({
        include: [{
          model: User,
          as: 'autor',
          where: { rol: 'docente', grupoId: usuario.grupoId },
          attributes: ['username', 'name', 'rol']
        }],
        order: [['fechaLimite', 'ASC']],
        raw: false
      })
    }
    res.json(actividades)
  } catch (error) {
    console.error('Error al obtener tareas:', error)
    console.error('Stack trace:', error.stack)
    res.status(500).json({ error: 'Error al obtener las tareas', details: error.message })
  }
})

// Añadir este nuevo endpoint GET
actividadesRouter.get('/', async (req, res) => {
  try {
    console.log('Obteniendo tareas...');
    const actividades = await Actividad.findAll({
      include: [{
        model: User,
        as: 'autor',
        attributes: ['username', 'name', 'rol']
      }],
      raw: false
    })
    res.json(actividades)
  } catch (error) {
    console.error('Error al obtener tareas:', error)
    res.status(500).json({ error: 'Error al obtener las tareas', details: error.message })
  }
})

// POST para crear tarea con preguntas
actividadesRouter.post('/', userExtractor, permitRoles('docente', 'administrador'), async (req, res) => {
  try {
    const { titulo, descripcion, fechaLimite, preguntas } = req.body
    const user = req.user

    // Validación básica
    if (!titulo) {
      return res.status(400).json({ error: 'El título es obligatorio' })
    }

    if (!fechaLimite) {
      return res.status(400).json({ error: 'La fecha límite es obligatoria' })
    }

    // Validación de preguntas
    if (!preguntas || !Array.isArray(preguntas) || preguntas.length === 0) {
      return res.status(400).json({ error: 'Debe proporcionar al menos una pregunta' })
    }

    // Validar estructura de cada pregunta
    for (const pregunta of preguntas) {
      if (!pregunta.pregunta) {
        return res.status(400).json({ error: 'Cada pregunta debe tener un texto' })
      }
      
      if (!pregunta.opciones || !Array.isArray(pregunta.opciones) || pregunta.opciones.length === 0) {
        return res.status(400).json({ error: 'Cada pregunta debe tener al menos una opción' })
      }

      // Verificar que haya exactamente una respuesta correcta
      const opcionesCorrectas = pregunta.opciones.filter(opcion => opcion.esCorrecta)
      if (opcionesCorrectas.length !== 1) {
        return res.status(400).json({ 
          error: 'Cada pregunta debe tener exactamente una opción correcta' 
        })
      }
    }

    const nuevaActividad = await Actividad.create({
      titulo,
      descripcion,
      fechaLimite: new Date(fechaLimite),
      preguntas: preguntas,
      creadorId: user.id
    })

    // Obtener la tarea con la información del usuario
    const actividadConUsuario = await Actividad.findOne({
      where: { id: nuevaActividad.id },
      include: [{
        model: User,
        as: 'autor',
        attributes: ['username', 'name', 'rol']
      }]
    })
    res.status(201).json(actividadConUsuario)
  } catch (error) {
    console.error('Error al crear tarea:', error)
    res.status(500).json({ error: error.message })
  }
})

// POST para responder una pregunta específica de una tarea
actividadesRouter.post('/:id/responder', userExtractor, permitRoles('estudiante'), async (req, res) => {
  try {
    const { preguntaIndex, respuestaIndex } = req.body
    const user = req.user


    const actividad = await Actividad.findOne({
      where: { id: req.params.id }
    })

    if (!actividad) {
      return res.status(404).json({ error: 'Actividad no encontrada' })
    }

  let preguntas = actividad.preguntas || []
    if (typeof preguntas === 'string') {
      preguntas = JSON.parse(preguntas)
    }

    // Validar que el índice de la pregunta sea válido
    if (preguntaIndex < 0 || preguntaIndex >= preguntas.length) {
      return res.status(400).json({ error: 'Índice de pregunta inválido' })
    }

    // Validar que el índice de la respuesta sea válido
    if (respuestaIndex < 0 || respuestaIndex >= preguntas[preguntaIndex].opciones.length) {
      return res.status(400).json({ error: 'Índice de respuesta inválido' })
    }

    // Inicializar el array de respuestas si no existe
    if (!preguntas[preguntaIndex].respuestas) {
      preguntas[preguntaIndex].respuestas = []
    }

    // Verificar si el usuario ya respondió esta pregunta
    const respuestaExistente = preguntas[preguntaIndex].respuestas.findIndex(
      r => r.usuarioId === user.id
    )

    // Crear la nueva respuesta
    const nuevaRespuesta = {
      usuarioId: user.id,
      seleccion: respuestaIndex,
      timestamp: new Date()
    }

    if (respuestaExistente >= 0) {
      // Actualizar respuesta existente
      preguntas[preguntaIndex].respuestas[respuestaExistente] = nuevaRespuesta
    } else {
      // Agregar nueva respuesta
      preguntas[preguntaIndex].respuestas.push(nuevaRespuesta)
    }

    // Verificar si todas las preguntas han sido respondidas
    const todasRespondidas = preguntas.every(pregunta => 
      pregunta.respuestas?.some(r => r.usuarioId === user.id)
    )

    // Actualizar la tarea en la base de datos
    await actividad.update({
      preguntas: preguntas,
      completada: todasRespondidas
    })

    // Obtener la tarea actualizada con la información del usuario
    const actividadActualizada = await Actividad.findOne({
      where: { id: actividad.id },
      include: [{
        model: User,
        as: 'autor',
        attributes: ['username', 'name', 'rol']
      }]
    })
    res.json(actividadActualizada)
  } catch (error) {
    console.error('Error al responder pregunta:', error)
    res.status(500).json({ error: error.message })
  }
})

module.exports = actividadesRouter
