import coordinatorMatcher from "../models/coordinatorMatcher.js";
import District from "../models/district.js";
import Survey from "../models/survey.js";
import Village from "../models/village.js";

const fetchSurveyData = async(req,res)=>{
    try{
        const {villageId,districtId,stateId} = req.params;
        if(!villageId) throw new Error("village Id is missing");

        let coordinaterData;

       
        let surveyList = [];
        if(stateId==-1){
            surveyList = await Survey.findAll({where: {isDeleted: false},raw: true,attributes:['id','name','familyCount']});
        }
        if(districtId==-1){
            let villageList = [];
            const districtList = await District.findAll({where: {isDeleted:false, stateId:stateId},raw:true, attributes:['id']});
            for(let district of districtList){
                let currVillageList = await Village.findAll({where: {isDeleted: false, districtId:district.id},raw: true,attributes:['id']});
                villageList=[...currVillageList, ...villageList];
            }
            for(let village of villageList){
                let currSurveyList = await Survey.findAll({where:{villageId:village.id, isDeleted:false}, raw:true,attributes:['id','name','familyCount']});
                surveyList = [...surveyList, ...currSurveyList];
            }
        }
        else if(villageId==-1){
            // let villageList = [];
            const villageList = await Village.findAll({where: {isDeleted:false, districtId:districtId},raw:true, attributes:['id']});
            for(let village of villageList){
                let currSurveyList = await Survey.findAll({where:{villageId:village.id, isDeleted:false}, raw:true,attributes:['id','name','familyCount']});
                surveyList = [...surveyList, ...currSurveyList];
            }
        }
        else surveyList = await Survey.findAll({where: {isDeleted: false, villageId:villageId},raw: true,attributes:['id','name','familyCount']});
        res.status(200).json({
            status: true,
            message:'Successfully fetched the user data',
            data: surveyList
        });

    }catch(err){
        console.log(err);
        res.status(401).json({
            status: false,
            message:"Failed to fetch the survey data",
            error:err.message
        });
    }
}

export default fetchSurveyData;