const express = require('express');
const router = express.Router();
const { RespuestaActividad, User, Actividad } = require('../models');
const middleware = require('../utils/middleware');

// Obtener todas las respuestas de una actividad
router.get('/actividad/:actividadId', async (req, res) => {
  try {
    const { actividadId } = req.params;
    const respuestas = await RespuestaActividad.findAll({
      where: { actividadId },
      include: [
        { model: User, as: 'usuario', attributes: ['id', 'username', 'name', 'rol'] }
      ]
    });
    res.json(respuestas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener respuestas' });
  }
});

// Crear o actualizar respuesta de usuario a una actividad
router.post('/actividad/:actividadId', middleware.userExtractor, async (req, res) => {
  try {
    const { actividadId } = req.params;
    const userId = req.user.id;
    const { respuestaTexto, archivoUrl } = req.body;
    let respuesta = await RespuestaActividad.findOne({ where: { actividadId, userId } });
    if (respuesta) {
      respuesta.respuestaTexto = respuestaTexto || respuesta.respuestaTexto;
      respuesta.archivoUrl = archivoUrl || respuesta.archivoUrl;
      await respuesta.save();
    } else {
      respuesta = await RespuestaActividad.create({ actividadId, userId, respuestaTexto, archivoUrl });
    }
    res.json(respuesta);
  } catch (error) {
    res.status(500).json({ error: 'Error al guardar respuesta' });
  }
});

// Eliminar respuesta
router.delete('/:id', middleware.userExtractor, async (req, res) => {
  try {
    const { id } = req.params;
    const respuesta = await RespuestaActividad.findByPk(id);
    if (!respuesta) return res.status(404).json({ error: 'No encontrada' });
    await respuesta.destroy();
    res.json({ message: 'Respuesta eliminada' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar respuesta' });
  }
});

// Agregar o editar retroalimentación y nota
router.put('/retroalimentacion/:id', middleware.userExtractor, async (req, res) => {
  try {
    const { id } = req.params;
    const { retroalimentacion, nota } = req.body;
    const respuesta = await RespuestaActividad.findByPk(id);
    if (!respuesta) return res.status(404).json({ error: 'No encontrada' });
    respuesta.retroalimentacion = retroalimentacion;
    respuesta.nota = nota;
    await respuesta.save();
    res.json(respuesta);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar retroalimentación' });
  }
});

module.exports = router;
