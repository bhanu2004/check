import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Survey =  sequelize.define('Survey',{
    name:{
      type: DataTypes.STRING,
      allowNull: false
    },
    familyCount:{
        type: DataTypes.INTEGER
    },
    villageId:{
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Village',
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
  })

  export default Survey;