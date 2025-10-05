const { sequelize } = require('../db');
const Grabacion = require('./grabacion');
const User = require('./user');
const Contacto = require('./contacto');
const Actividad = require('./actividad');
const Asesoria = require('./asesoria');
const RespuestaActividad = require('./respuestaActividad');
// Asociaciones RespuestaActividad
RespuestaActividad.belongsTo(User, { foreignKey: 'userId', as: 'usuario' });
RespuestaActividad.belongsTo(Actividad, { foreignKey: 'actividadId', as: 'actividad' });
User.hasMany(RespuestaActividad, { foreignKey: 'userId', as: 'respuestasActividades' });
Actividad.hasMany(RespuestaActividad, { foreignKey: 'actividadId', as: 'respuestas' });

// Asociaciones Grabacion
Grabacion.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});
User.hasMany(Grabacion, {
  foreignKey: 'userId',
  as: 'grabaciones'
});
// Asociaciones Actividad
Actividad.belongsTo(User, {
  foreignKey: 'creadorId',
  as: 'autor'
});
User.hasMany(Actividad, {
  foreignKey: 'creadorId',
  as: 'actividades'
});

// Asociaciones Asesoria
Asesoria.belongsTo(User, {
  foreignKey: 'userId',
  as: 'asesor'
});
User.hasMany(Asesoria, {
  foreignKey: 'userId',
  as: 'asesorias'
});

// Test database connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

// Sync all models
const syncModels = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('Models synchronized successfully');
  } catch (error) {
    console.error('Error synchronizing models:', error);
    process.exit(1);
  }
};

module.exports = {
  sequelize,
  Grabacion,
  User,
  Contacto,
  Actividad,
  Asesoria,
  RespuestaActividad,
  testConnection,
  syncModels
};