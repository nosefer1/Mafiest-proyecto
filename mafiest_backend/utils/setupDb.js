const { sequelize } = require('../db');
const { User, Blog, Contact, Tarea } = require('../models');
const logger = require('./logger');
const bcrypt = require('bcrypt');

const setupDatabase = async () => {
  try {
    await sequelize.sync({ force: true });
    
    // Crear usuarios iniciales
    await User.bulkCreate([
      {
        username: 'admin',
        name: 'Administrador Principal',
        email: 'admin@example.com',
        passwordHash: await bcrypt.hash('admin123', 10),
        rol: 'administrador'
      },
      {
        username: 'docente1',
        name: 'Docente Demo',
        email: 'docente@example.com',
        passwordHash: await bcrypt.hash('docente123', 10),
        rol: 'docente'
      },
      {
        username: 'estudiante1',
        name: 'Estudiante Demo',
        email: 'estudiante@example.com',
        passwordHash: await bcrypt.hash('estudiante123', 10),
        rol: 'estudiante'
      },
      {
        username: 'independiente1',
        name: 'Independiente Demo',
        email: 'independiente@example.com',
        passwordHash: await bcrypt.hash('independiente123', 10),
        rol: 'independiente'
      }
    ]);

    logger.info('Usuarios iniciales creados correctamente');
  } catch (error) {
    logger.error('Error en la configuración:', error);
  }
};

// Run setup if this file is executed directly
if (require.main === module) {
  setupDatabase();
}