import State from "../../models/state.js"
import District from "../../models/district.js";
import Village from "../../models/village.js";
import Survey from "../../models/survey.js";
import coordinatorMatcher from "../../models/coordinatorMatcher.js";
import User from "../../models/user.js";
import { Sequelize } from "sequelize";

class stateController{
    static allottedState = async(req,res)=>{
      try{

        State.hasMany(coordinatorMatcher, {foreignKey: 'stateId'})
        coordinatorMatcher.belongsTo(State, {foreignKey: 'stateId'})
        
        const stateList = await State.findAll({ 
          attributes: ['id', 'name'],
          include: [{
            model: coordinatorMatcher,
            required: true,
            attributes:[],
            where: {
              'coordinatorId': req.user.id, 
              'isDeleted':false
            }
          }],
          raw:true
        })

        res.status(201).json({
          status:true,
          message: 'Successfully fetched assigned states',
          data:stateList
        })
      }catch(err){
        console.log(err);
        res.status(401).json({
          status:false,
          message: 'failed fetched assigned states',
          error:err.message
        })
      }
       
    }
    static fetchVillageList = async(req,res)=>{
      try{
          const {stateId, districtId} = req.params;
          if(!districtId) throw new Error("district Id is missing");
          let villageList = [];
          if(stateId==-1){
              const districtList = await District.findAll({where: {isDeleted:false},raw:true, attributes:['id']});
              for(let district of districtList){
                  let currVillageList = await Village.findAll({where: {isDeleted: false, districtId:district.id},raw: true,attributes:['id','name']});
                  villageList=[...currVillageList, ...villageList];
              }
              // villageList = await Village.findAll({where: {isDeleted: false},raw: true,attributes:['id','name']});
          }
          if(districtId==-1){
              const districtList = await District.findAll({where: {isDeleted:false, stateId:stateId},raw:true, attributes:['id']});
              console.log("districtList",districtList);
              for(let district of districtList){
                  let currVillageList = await Village.findAll({where: {isDeleted: false, districtId:district.id},raw: true,attributes:['id','name']});
                  villageList=[...currVillageList, ...villageList];
              }
          }
          else villageList = await Village.findAll({where: {isDeleted: false, districtId:districtId},raw: true,attributes:['id','name']});
          res.status(200).json({
              status: true,
              message:'Successfully fetched the village',
              data: villageList
          });
      }catch(err){
          console.log(err);
          res.status(401).json({
              status: false,
              message:"Failed to fetch the village list",
              error:err.message
          });
      }
  }

    static fetchDistrictList = async(req,res)=>{
      try{
        let {stateId} = req.params;
         stateId = +stateId
        console.log("stateId",stateId);
        console.log("userId",req.user.id);
        if(!stateId) throw new Error("StateId is missing");

        // permission check ------------>
        // const coordinatorData = await coordinatorMatcher.findOne({where:{stateId:stateId},raw:true});
        // console.log(coordinatorData);
        // if(!coordinatorData || coordinatorData.coordinatorId!==req.user.id) throw new Error("Unauthorized Access") ;
        
        // fetch district list ------------->
        let districtList=[];
        if(stateId === -1){
          State.hasMany(coordinatorMatcher, {foreignKey: 'stateId'})
          coordinatorMatcher.belongsTo(State, {foreignKey: 'stateId'})
        
        let alloted_stateList = await State.findAll({ 
          attributes: ['id', 'name'],
          include: [{model: coordinatorMatcher,required: true, attributes:[],
            where: {'coordinatorId': req.user.id,'isDeleted':false}}],
          raw:true
        })
        for(let state of alloted_stateList){
            District.hasMany(coordinatorMatcher, {foreignKey: 'districtId'})
        coordinatorMatcher.belongsTo(District, {foreignKey: 'districtId'});
        coordinatorMatcher.belongsTo(User, { foreignKey: 'coordinatorId' });

        // const stateList = await State.findAll({where: {isDeleted: false},raw: true,attributes:['id','name']});
     
        
         let currDistrictList = await District.findAll({ 
          attributes: [
            'id', 'name',
            [Sequelize.col("CoordinateMatchers.User.id"), "coordinatorId"],
            [Sequelize.col("CoordinateMatchers.User.name"), "username"],
            [Sequelize.col("CoordinateMatchers.User.email"), "usermail"],

        ],
        where: {'isDeleted':false,'stateId': state.id},
          include: [{model: coordinatorMatcher, attributes:[],required: false,
            where: {'isDeleted':false},
            include: [{model: User,attributes:[]}]
          }],
          raw:true
        })
        districtList = [...districtList, ...currDistrictList];

       }
      }
       else{
        // }
        // districtList = await District.findAll({where:{stateId:stateId, isDeleted:false}, raw:true, attributes:['id','name']});
        District.hasMany(coordinatorMatcher, {foreignKey: 'districtId'})
        coordinatorMatcher.belongsTo(District, {foreignKey: 'districtId'});
        coordinatorMatcher.belongsTo(User, { foreignKey: 'coordinatorId' });

        // const stateList = await State.findAll({where: {isDeleted: false},raw: true,attributes:['id','name']});
     
        
         districtList = await District.findAll({ 
          attributes: [
            'id', 'name',
            [Sequelize.col("CoordinateMatchers.User.id"), "coordinatorId"],
            [Sequelize.col("CoordinateMatchers.User.name"), "username"],
            [Sequelize.col("CoordinateMatchers.User.email"), "usermail"],

        ],
        where: {
            'isDeleted':false,
            'stateId': stateId
          },
          include: [{
            model: coordinatorMatcher,
            attributes:[],
            required: false,
            where: {
              'isDeleted':false
            },
            include: [{
                model: User,
                attributes:[]
                // attributes: [['id','coordinatorId'],['name','userName'], ['email','userEmail']],
            }]
          }],
          raw:true
        })
      }
        districtList.sort((a,b)=>a.id-b.id);
        res.status(201).json({
          status:true,
          message: 'Successfully fetched districts',
          data:districtList
        })

      }catch(err){
        console.log(err);
        res.status(401).json({
          status:false,
          message: 'failed fetched district list',
          error:err.message
        })
      }

    
    }
    
}

export default stateController;