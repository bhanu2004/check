import { Sequelize } from "sequelize";
import State from "../../models/state.js"
import District from "../../models/district.js";
import Village from "../../models/village.js";
import Survey from "../../models/survey.js";
import coordinatorMatcher from "../../models/coordinatorMatcher.js";
import User from "../../models/user.js";
import { findAllotedDistrict, findSurveyList, onlyVillageList, villageWithCoordinator } from "../functions/district.js";

class districtController{
    static allottedDistrict = async(req,res)=>{
      try{

        const districtList = await findAllotedDistrict(req.user.id);

        res.status(201).json({
          status:true,
          message: 'Successfully fetched assigned districts',
          data:districtList
        })
      }catch(err){
        console.log(err);
        res.status(401).json({
          status:false,
          message: 'failed fetched assigned districts',
          error:err
        })
      }
       
    }
    static fetchOnlyVillageList = async(req,res)=>{
      try{
        const {districtId} = req.params;
        if(!districtId) throw new Error("districtId is missing");

        // permission check ------------>
        // const coordinatorData = await coordinatorMatcher.findOne({where:{districtId:districtId},raw:true});
        // if(!coordinatorData || coordinatorData.coordinatorId!==req.user.id) throw new Error("Unauthorized Access") ;

        // fetch village list ------------->

        let villageList = await onlyVillageList(districtId);

        res.status(201).json({
          status:true,
          message: 'Successfully fetched villages',
          data:villageList
        })

      }catch(err){
        console.log(err);
        res.status(401).json({
          status:false,
          message: 'failed to fetch vilaged list',
          error:err.message
        })
      }

    }
    static fetchVillageList = async(req,res)=>{
      try{
        const {districtId} = req.params;
        if(!districtId) throw new Error("districtId is missing");

        // permission check ------------>
        // const coordinatorData = await coordinatorMatcher.findOne({where:{districtId:districtId},raw:true});
        // if(!coordinatorData || coordinatorData.coordinatorId!==req.user.id) throw new Error("Unauthorized Access") ;

        // fetch village list ------------->

        let villageList = [];

        if(districtId == -1){
     
          let alloted_DistrictList = await findAllotedDistrict(req.user.id);
          for(let district of alloted_DistrictList){
            let currVillageList = await villageWithCoordinator(district.id); 
            villageList = [...villageList, ...currVillageList];
          }
        }
       else{  
         villageList = await villageWithCoordinator(districtId); 
      }

        res.status(201).json({
          status:true,
          message: 'Successfully fetched villages',
          data:villageList
        })

      }catch(err){
        console.log(err);
        res.status(401).json({
          status:false,
          message: 'failed to fetch vilaged list',
          error:err.message
        })
      }

    }

    static fetchSurveyList = async(req,res)=>{
      try{
        const {districtId, villageId} = req.params; 
        let surveyList = [];
        if(districtId==-1){
          const districtList = await findAllotedDistrict(req.user.id);
          let villageList = [];
          for(let district of districtList){
            let currVillageList = await onlyVillageList(district.id); 
            villageList = [...villageList, ...currVillageList];
          }
          for(let village of villageList){
            let currSurveyList = await findSurveyList(village.id);
            surveyList = [...surveyList,...currSurveyList];
          }
        }
        else if(villageId==-1){
          let villageList = await onlyVillageList(districtId);
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
          message: 'Successfully fetched villages',
          data:surveyList
        })
      }catch(err){
        console.log(err);
        res.status(401).json({
          status:false,
          message: 'failed to fetch vilaged list',
          error:err.message
        })
      }
    }
    

}

export default districtController;