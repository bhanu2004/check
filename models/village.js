import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Village =  sequelize.define('Village',{
    name:{
      type: DataTypes.STRING,
      allowNull: false
    },
    districtId:{
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'District',
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

 
  
export default Village;