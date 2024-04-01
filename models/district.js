import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import State from './state.js';

const District =  sequelize.define('District',{
    name:{
      type: DataTypes.STRING,
      allowNull: false
    },
    stateId:{
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'State',
        key: 'id'
      }
    },
    isDeleted:{
      type:DataTypes.BOOLEAN,
      defaultValue:false
    }
  },{
    freezeTableName: true,
    timestamps: true
  });


// District.belongsTo(State, { foreignKey: 'id' });
  

  export default District;