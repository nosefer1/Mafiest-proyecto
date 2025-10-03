const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');


const Grabacion = sequelize.define('Grabacion', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT('long'),
    allowNull: false
  },
  driveLink: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  grupoId: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'grabaciones',
  timestamps: true
});

module.exports = Grabacion;
