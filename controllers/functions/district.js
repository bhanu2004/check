import { Sequelize } from "sequelize";
import coordinatorMatcher from "../../models/coordinatorMatcher.js";
import District from "../../models/district.js";
import Survey from "../../models/survey.js";
import User from "../../models/user.js";
import Village from "../../models/village.js";

const findAllotedDistrict = (id)=>{
    return new Promise (async(resolve, reject)=>{
        try{
            District.hasMany(coordinatorMatcher, {foreignKey: 'districtId'});
            const districtList = await District.findAll({
                attributes: ['id', 'name'], 
                include: [{
                  model: coordinatorMatcher,
                  attributes:[],
                  required: true, 
                  where: {
                    'coordinatorId': id, 
                    'isDeleted':false
                  }
                }],
                raw:true
              })

            resolve(districtList);
    
        }catch(err){
            reject(err)
        }
    })
 
}
const onlyVillageList = async(id)=>{
    return new Promise(async(resolve,reject)=>{
        try{
            let villageList = await Village.findAll({
                attributes:['id', 'name'],
                where:{'isDeleted':false, 'districtId':id},
                raw:true
            })
            resolve(villageList);
        }catch(err){
            reject(err);
        }
    })
}
const findSurveyList = async(id)=>{
    return new Promise(async(resolve,reject)=>{
        try{
            let surveyList = await Survey.findAll({
                attributes:['id', 'name', 'familyCount'],
                where:{'isDeleted':false, 'villageId':id}
            })
            resolve(surveyList);
        }catch(err){
            reject(err);
        }
    })
}
const villageWithCoordinator = async(id)=>{
    return new Promise (async(resolve, reject)=>{
        try{
            Village.hasMany(coordinatorMatcher, {foreignKey: 'villageId'})
            coordinatorMatcher.belongsTo(Village, {foreignKey: 'villageId'});
            coordinatorMatcher.belongsTo(User, { foreignKey: 'coordinatorId' });
            
            let villageList = await Village.findAll({ 
                attributes: [
                  'id', 'name',
                  [Sequelize.col("CoordinateMatchers.User.id"), "coordinatorId"],
                  [Sequelize.col("CoordinateMatchers.User.name"), "username"],
                  [Sequelize.col("CoordinateMatchers.User.email"), "usermail"],
      
              ],
              where: {'isDeleted':false,'districtId': id},
                include: [{model: coordinatorMatcher, attributes:[],required: false,
                  where: {'isDeleted':false},
                  include: [{model: User,attributes:[]}]
                }],
                raw:true
              })

               resolve(villageList);
        }catch(err){
            reject(err);
        }
    })

}

export {findAllotedDistrict, findSurveyList, onlyVillageList, villageWithCoordinator};