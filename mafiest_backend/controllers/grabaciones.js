const grabacionesRouter = require('express').Router()
const { Grabacion, User } = require('../models')
const { userExtractor, permitRoles } = require('../utils/middleware')

// GET grabaciones según permisos
grabacionesRouter.get('/', userExtractor, async (req, res) => {
  try {
    let where = {};
    if (req.user.rol === 'independiente') {
      where.grupoId = null;
    } else if (req.user.rol === 'estudiante') {
      where.grupoId = req.user.grupoId;
    } else if (req.user.rol === 'docente') {
      where.userId = req.user.id;
    }
    const grabaciones = await Grabacion.findAll({
      where,
      include: [{ model: User, as: 'user', attributes: ['username', 'name'] }],
      order: [['createdAt', 'DESC']]
    });
    res.json(grabaciones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Crear grabación (solo docente o admin)
grabacionesRouter.post('/', userExtractor, permitRoles('docente', 'administrador'), async (req, res) => {
  const { title, description, driveLink, grupoId } = req.body;
  if (!title || !description || !driveLink) {
    return res.status(400).json({ error: 'title, description y driveLink son requeridos' });
  }
  try {
    const grabacion = await Grabacion.create({
      title,
      description,
      driveLink,
      userId: req.user.id,
      grupoId: req.user.rol === 'administrador' ? null : grupoId || req.user.grupoId
    });
    res.status(201).json(grabacion);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});



module.exports = grabacionesRouter
