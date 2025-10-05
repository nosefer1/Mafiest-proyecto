const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const RespuestaActividad = sequelize.define('RespuestaActividad', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  actividadId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  archivoUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  respuestaTexto: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  retroalimentacion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  nota: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: { min: 1, max: 5 }
  }
}, {
  tableName: 'respuestas_actividad',
  timestamps: true
});

module.exports = RespuestaActividad;
