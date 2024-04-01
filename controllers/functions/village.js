import coordinatorMatcher from "../../models/coordinatorMatcher.js";
import Survey from "../../models/survey.js";
import Village from "../../models/village.js";

const findVillageList = async(id)=>{
    return new Promise(async(resolve,reject)=>{
        try{
            Village.hasMany(coordinatorMatcher, {foreignKey: 'villageId'});
          
            const villageList = await Village.findAll({
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
export {findVillageList, findSurveyList};