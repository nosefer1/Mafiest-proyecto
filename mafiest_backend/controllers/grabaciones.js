const grabacionesRouter = require('express').Router()
const { Grabacion, User } = require('../models')
const { userExtractor, permitRoles } = require('../utils/middleware')

// GET grabaciones según permisos

// GET grabaciones según permisos y tipo
grabacionesRouter.get('/', userExtractor, async (req, res) => {
  try {
    let where = {};
    if (req.user.rol === 'administrador') {
      // Admin ve todas
    } else if (req.user.rol === 'docente') {
      // Docente ve generales y sus grupales
      where = {
        [Op.or]: [
          { tipo: 'general' },
          { tipo: 'grupal', grupoId: req.user.grupoId }
        ]
      }
    } else if (req.user.rol === 'estudiante') {
      // Estudiante ve generales y grupales de su grupo
      where = {
        [Op.or]: [
          { tipo: 'general' },
          { tipo: 'grupal', grupoId: req.user.grupoId }
        ]
      }
    } else if (req.user.rol === 'independiente') {
      // Independiente solo generales
      where = { tipo: 'general' }
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
  const { title, description, driveLink, grupoId, tipo } = req.body;
  if (!title || !description || !driveLink) {
    return res.status(400).json({ error: 'title, description y driveLink son requeridos' });
  }
  try {
    let grabacionTipo = tipo;
    let grabacionGrupoId = grupoId;
    if (req.user.rol === 'administrador') {
      grabacionTipo = 'general';
      grabacionGrupoId = null;
    } else if (req.user.rol === 'docente') {
      grabacionTipo = tipo === 'grupal' ? 'grupal' : 'general';
      if (grabacionTipo === 'grupal') {
        grabacionGrupoId = grupoId || req.user.grupoId;
      } else {
        grabacionGrupoId = null;
      }
    }
    const grabacion = await Grabacion.create({
      title,
      description,
      driveLink,
      userId: req.user.id,
      grupoId: grabacionGrupoId,
      tipo: grabacionTipo
    });
    res.status(201).json(grabacion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



module.exports = grabacionesRouter
