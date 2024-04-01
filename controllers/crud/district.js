import { Sequelize } from 'sequelize';
import coordinatorMatcher from '../../models/coordinatorMatcher.js';
import District from '../../models/district.js';
import User from '../../models/user.js';
// import insertDataHandler from './insertDataHandler.js';

class crudDistrict{
    static create = async(req,res)=>{
        try{
            const {stateId,name} = req.body;
            if(!stateId || !name) return res.status(400).json({error:"Please provide all fields"});
            const newData = District.build({stateId:stateId, name:name});
            await newData.save();

            res.status(200).json({
                status: true,
                message:'Successfully created a new district',
            });
        }catch(err){
            console.log(err);
            res.status(401).json({
                status: false,
                message:"Failed to create the district",
                error:err
            });
        }
    }
    static read = async(req,res)=>{
        try{
            const {stateId} = req.params;
            if(!stateId) throw new Error("state Id is missing");
            
            // const districtList = await District.findAll({where: {isDeleted: false, stateId:stateId},raw: true,attributes:['id','name']});

            District.hasMany(coordinatorMatcher, {foreignKey: 'districtId'})
            coordinatorMatcher.belongsTo(District, {foreignKey: 'districtId'});
            coordinatorMatcher.belongsTo(User, { foreignKey: 'coordinatorId' });

            // const stateList = await State.findAll({where: {isDeleted: false},raw: true,attributes:['id','name']});
            let districtList;
            if(stateId==-1){
                districtList = await District.findAll({ 
                    attributes: ['id', 'name'],
                    where:{'isDeleted':false},
                    raw:true
                    })
            }
            else{

                districtList = await District.findAll({ 
                    attributes: ['id', 'name'],
                    where:{'stateId':stateId, 'isDeleted':false},
                    raw:true
                    })
            }

            res.status(200).json({
                status: true,
                message:'Successfully fetched the districts',
                data: districtList
            });
        }catch(err){
            console.log(err);
            res.status(401).json({
                status: false,
                message:"Failed to fetch the district list",
                error:err.message
            });
        }
    }
    static update = async(req,res)=>{
        try{
            const {id, name} =  req.body;
            if (!id || !name ) throw new Error("Missing field in request body");

            const district = await District.findAll({where: {id: id},raw: true,});
            if(district.length!==1) throw new Error("Can't find the district");

            await District.update({name:name}, {where: {id: id}});
            res.status(200).json({
                status: true,
                message:'Successfully updated the district',
            });
        }catch(err){
            console.log(err);
            res.status(401).json({
                status: false,
                message:"Failed to update the district",
                error:err.message
            });
        }
    }
    static delete = async(req,res)=>{
        try{
            const {id} =  req.params;
            if (!id ) throw new Error("Missing field in request body");

            const district = await District.findAll({where: {id: id},raw: true,});
            if(district.length!==1) throw new Error("Can't find the district");

            await District.update({isDeleted:true}, {where: {id: id}});
            res.status(200).json({
                status: true,
                message:'Successfully deleted the district',
            });
        }catch(err){
            console.log(err);
            res.status(401).json({
                status: false,
                message:"Failed to delete the district",
                error:err.message
            });
        }
    }
}

export default crudDistrict;