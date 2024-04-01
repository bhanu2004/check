import { Sequelize } from 'sequelize';
import coordinatorMatcher from '../../models/coordinatorMatcher.js';
import State from '../../models/state.js'
import User from '../../models/user.js';

class crudState{
    static create = async(req,res)=>{
        try{
            if(!req.body.name) return res.status(400).json({error:"Please provide state name"});
            const newData = State.build({...req.body});
            await newData.save();

            res.status(200).json({
                status: true,
                message:'Successfully created a new state',
            });
        }catch(err){
            console.log(err);
            res.status(401).json({
                status: false,
                message:"Failed to create the state",
                error:err
            });
        }
    }
    static read = async(req,res)=>{
        try{
            State.hasMany(coordinatorMatcher, {foreignKey: 'stateId'})
            coordinatorMatcher.belongsTo(State, {foreignKey: 'stateId'});
            coordinatorMatcher.belongsTo(User, { foreignKey: 'coordinatorId' });

            // const stateList = await State.findAll({where: {isDeleted: false},raw: true,attributes:['id','name']});
           
        
        const stateList = await State.findAll({ 
          attributes: [
            'id', 'name',
            [Sequelize.col("CoordinateMatchers.User.id"), "coordinatorId"],
            [Sequelize.col("CoordinateMatchers.User.name"), "username"],
            [Sequelize.col("CoordinateMatchers.User.email"), "usermail"],

        ],
        where: {
            'isDeleted':false
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
            res.status(200).json({
                status: true,
                message:'Successfully fetched the states',
                data: stateList
            });
        }catch(err){
            console.log(err);
            res.status(401).json({
                status: false,
                message:"Failed to fetch the state list",
                error:err
            });
        }
    }
    static update = async(req,res)=>{
        try{
            const {id, name} =  req.body;
            if (!id || !name ) throw new Error("Missing field in request body");

            const state = await State.findAll({where: {id: id},raw: true,});
            if(state.length!==1) throw new Error("Can't find the state");

            await State.update({name:name}, {where: {id: id}});
            res.status(200).json({
                status: true,
                message:'Successfully updated the state',
            });
        }catch(err){
            console.log(err);
            res.status(401).json({
                status: false,
                message:"Failed to update the state",
                error:err.message
            });
        }
    }
    static delete = async(req,res)=>{
        try{
            const {id} =  req.params;
            console.log("id",id);
            if (!id ) throw new Error("Missing field in request body");

            const state = await State.findAll({where: {id: id},raw: true,});
            if(state.length!==1) throw new Error("Can't find the state");

            await State.update({isDeleted:true}, {where: {id: id}});
            res.status(200).json({
                status: true,
                message:'Successfully deleted the state',
            });
        }catch(err){
            console.log(err);
            res.status(401).json({
                status: false,
                message:"Failed to delete the state",
                error:err.message
            });
        }
    }

    static stateList = async(req,res)=>{
        try{

            const stateList = await State.findAll({where: {isDeleted: false},raw: true,attributes:['id','name']});
           
            res.status(200).json({
                status: true,
                message:'Successfully fetched the states',
                data: stateList
            });
        }catch(err){
            console.log(err);
            res.status(401).json({
                status: false,
                message:"Failed to fetch the state list",
                error:err
            });
        }
    }
}

export default crudState;