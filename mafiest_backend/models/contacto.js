const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const Contacto = sequelize.define('Contacto', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  number: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    validate: {
      isEmail: true
    }
  },
  comments: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'contactos',
  timestamps: true
});

module.exports = Contacto;
