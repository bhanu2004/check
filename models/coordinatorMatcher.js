import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const coordinatorMatcher =  sequelize.define('CoordinateMatcher',{
    coordinatorId:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model: 'User',
            key:'id'
        }
    },
    stateId:{
        type: DataTypes.INTEGER,
        references: {
            model: 'State',
            key: 'id'
        }
    },
    districtId:{
        type: DataTypes.INTEGER,
        references: {
            model: 'District',
            key: 'id'
        }
    },
    villageId:{
        type: DataTypes.INTEGER,
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

  export default coordinatorMatcher;