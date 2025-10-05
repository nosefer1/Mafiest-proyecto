// Edit user info (self-update)
usersRouter.patch('/:id', async (request, response) => {
  try {
    const id = request.params.id;
    const { name, email, password, username } = request.body;
    const user = await User.findByPk(id);
    if (!user) {
      return response.status(404).json({ error: 'User not found' });
    }
    if (name) user.name = name;
    if (email) user.email = email;
    if (username) user.username = username;
    if (password) {
      const saltRounds = 10;
      user.passwordHash = await bcrypt.hash(password, saltRounds);
    }
    await user.save();
    response.json({
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      rol: user.rol,
      grupoId: user.grupoId
    });
  } catch (error) {
    response.status(400).json({ error: error.message });
  }
});
const usersRouter = require('express').Router();
const { User } = require('../models');
const bcrypt = require('bcrypt');

// Get all users
usersRouter.get('/', async (request, response) => {
  try {
    const users = await User.findAll({
      where: {},
  attributes: ['id', 'username', 'name', 'email', 'rol', 'grupoId']
    });
    response.json(users);
  } catch (error) {
    response.status(500).json({ error: 'Error retrieving users' });
  }
});

const validRoles = ['independiente', 'estudiante', 'docente', 'administrador'];

// Create new user
usersRouter.post('/', async (request, response) => {
  try {
  const { username, name, email, password, rol, grupoId } = request.body;

    // Validate required fields
    if (!username || !password || !name || !email) {
      return response.status(400).json({
        error: 'El usuario, contraseña, nombre y correo son requeridos'
      });
    }

    // Validate role
    if (!validRoles.includes(rol)) {
      return response.status(400).json({
        error: 'Rol inválido. Debe ser: independiente, estudiante, docente o administrador'
      });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = await User.create({
      username,
      name,
      email,
      passwordHash,
      rol,
      grupoId
    });

    response.status(201).json({
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      rol: user.rol,
      grupoId: user.grupoId
    });
  } catch (error) {
    console.error('Error creating user:', error);
    response.status(400).json({
      error: error.message
    });
  }
});

// Delete user
usersRouter.delete('/:id', async (request, response) => {
  try {
    const id = request.params.id;

    // Verificar si el usuario existe
    const user = await User.findByPk(id);
    if (!user) {
      return response.status(404).json({
        error: 'User not found'
      });
    }

    // Eliminar el usuario
    await user.destroy();
    response.status(204).end();
  } catch (error) {
    response.status(500).json({
      error: 'Error deleting user',
      details: error.message
    });
  }
});

module.exports = usersRouter;