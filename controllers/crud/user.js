import District from '../../models/district.js';
import User from '../../models/user.js';

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
            console.log("user called");
            const userList = await User.findAll({where: {isDeleted: false},raw: true});
            console.log("check >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
            userList.sort((a,b)=>a.id-b.id);
            console.log(userList);
            res.status(200).json({
                status: true,
                message:'Successfully fetched the users',
                data: userList
            });
        }catch(err){
            console.log(err);
            res.status(401).json({
                status: false,
                message:"Failed to fetch the user list",
                error:err
            });
        }
    }
    static update = async(req,res)=>{
        try{
            const {id} =  req.body;
            if (!id  ) throw new Error("Missing id in request body");

            const user = await User.findAll({where: {id: id, isDeleted:false},raw: true,});
            if(user.length!==1) throw new Error("Can't find the user");
            console.log("user",user);
            console.log("new",req.body);
            await user.update({...req.body}, {where: {id: id}});
            res.status(200).json({
                status: true,
                message:'Successfully updated the user',
            });
        }catch(err){
            console.log(err);
            res.status(401).json({
                status: false,
                message:"Failed to update the user",
                error:err.message
            });
        }
    }
    static delete = async(req,res)=>{
        try{
            const {id} =  req.body;
            if (!id ) throw new Error("Missing field in request body");

            const user = await User.findAll({where: {id: id},raw: true,});
            if(user.length!==1) throw new Error("Can't find the user");

            await User.update({isDeleted:true}, {where: {id: id}});
            res.status(200).json({
                status: true,
                message:'Successfully deleted the User',
            });
        }catch(err){
            console.log(err);
            res.status(401).json({
                status: false,
                message:"Failed to delete the User",
                error:err.message
            });
        }
    }
}
