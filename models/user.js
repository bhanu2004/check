import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
  },
  role:{
    type: DataTypes.STRING
  },
  isDeleted:{
    type :DataTypes.BOOLEAN,
    defaultValue:false
  }
}, {
  freezeTableName: true,
  timestamps: true
});

export default User;
