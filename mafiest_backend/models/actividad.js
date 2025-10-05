const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const Actividad = sequelize.define('Actividad', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  titulo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  fechaLimite: {
    type: DataTypes.DATE,
    allowNull: false
  },
  tipo: {
    type: DataTypes.ENUM('formulario', 'archivo'),
    allowNull: false,
    defaultValue: 'formulario'
  },
  archivoUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  preguntas: {
    type: DataTypes.TEXT,
    get() {
      const rawValue = this.getDataValue('preguntas');
      return rawValue ? JSON.parse(rawValue) : [];
    },
    set(value) {
      this.setDataValue('preguntas', JSON.stringify(value || []));
    }
  },
  creadorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  global: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  tableName: 'actividades',
  timestamps: true
});

module.exports = Actividad;
