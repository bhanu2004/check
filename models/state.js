import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const State =  sequelize.define('State',{
    name:{
      type: DataTypes.STRING,
      allowNull: false
    },
    isDeleted:{
      type:DataTypes.BOOLEAN,
      defaultValue:false
    }
  },{
    freezeTableName: true,
    timestamps: true
  });
  

  
  export default State;