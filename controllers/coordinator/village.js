import coordinatorMatcher from "../../models/coordinatorMatcher.js";
import Survey from "../../models/survey.js";
import Village from "../../models/village.js";
import { findSurveyList, findVillageList } from "../functions/village.js";

class villageController{
    static allottedVillage = async(req,res)=>{
        try{
          const villageList = await findVillageList(req.user.id);
          console.log(villageList,"vid0>>>>>>>>>>>>>>>>>>>>>>>")
          res.status(201).json({
            status:true,
            message: 'Successfully fetched assigned villages',
            data:villageList
          })
        }catch(err){
          console.log(err);
          res.status(401).json({
            status:false,
            message: 'failed fetched assigned villages',
            error:err.message
          })
        }
         
      }
    static addSurvey = async(req,res)=>{
        try{
            let {name, familyCount, villageId} = req.body;
            console.log("name",name,"fami",familyCount,"vill",villageId);
            if(!name || !familyCount || !villageId) throw new Error("fill all the fields");
            villageId = +villageId;
            // authenticate village coordinator --------------->
            const coordinaterData = await coordinatorMatcher.findOne({where:{villageId:villageId, isDeleted:false}, raw:true});
            if(!coordinaterData || coordinaterData.coordinatorId !== req.user.id) throw new Error("unauthorized access");

            const newSurvey = Survey.build({
                name:name,
                familyCount:familyCount,
                villageId:villageId

            })
            await newSurvey.save();
            res.status(200).json({
                status: true,
                message:'Successfully add the survey data',
            });

        }catch(err){
            console.log(err);
            res.status(401).json({
                status: false,
                message:"Failed to add the survey data",
                error:err.message
            });
        }
    }
    static fetchSurveyList = async(req,res)=>{
      try{
        const {villageId} = req.params; 
        console.log("village id", villageId);
        let surveyList = [];
        
        if(villageId==-1){
          let villageList = await findVillageList(req.user.id);
          console.log(villageList,"vidl>>>>>>>>>>>>>>>>>>>>>>>")
          for(let village of villageList){
            let currSurveyList = await findSurveyList(village.id);
            surveyList = [...surveyList, ...currSurveyList];
          }
        }
        else{
          surveyList = await findSurveyList(villageId);
        }
        res.status(201).json({
          status:true,
          message: 'Successfully fetched Survey',
          data:surveyList
        })
      }catch(err){
        console.log(err);
        res.status(401).json({
          status:false,
          message: 'failed to fetch Survey list',
          error:err.message
        })
      }
    }
    
}

export default villageController;