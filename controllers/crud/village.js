import District from '../../models/district.js';
import Village from '../../models/village.js';

class crudVillage{
    static create = async(req,res)=>{
        try{
            const {districtId,name} = req.body;
            if(!districtId || !name) throw new Error("Please provide all fields");
            const newData = Village.build({districtId:districtId, name:name});
            await newData.save();

            res.status(200).json({
                status: true,
                message:'Successfully created a new village',
            });
        }catch(err){
            console.log(err);
            res.status(401).json({
                status: false,
                message:"Failed to create the village",
                error:err.message
            });
        }
    }
    static read = async(req,res)=>{
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
            }
            else if(districtId==-1){
                const districtList = await District.findAll({where: {isDeleted:false, stateId:stateId},raw:true, attributes:['id']});
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
    static update = async(req,res)=>{
        try{
            const {id, name} =  req.body;
            if (!id || !name ) throw new Error("Missing field in request body");

            const village = await Village.findAll({where: {id: id},raw: true,});
            if(village.length!==1) throw new Error("Can't find the district");

            await Village.update({name:name}, {where: {id: id}});
            res.status(200).json({
                status: true,
                message:'Successfully updated the village',
            });
        }catch(err){
            console.log(err);
            res.status(401).json({
                status: false,
                message:"Failed to update the village",
                error:err.message
            });
        }
    }
    static delete = async(req,res)=>{
        try{
            const {id} =  req.params;
            if (!id ) throw new Error("Missing field in request body");

            const village = await Village.findAll({where: {id: id},raw: true,});
            if(village.length!==1) throw new Error("Can't find the village");

            await Village.update({isDeleted:true}, {where: {id: id}});
            res.status(200).json({
                status: true,
                message:'Successfully deleted the village',
            });
        }catch(err){
            console.log(err);
            res.status(401).json({
                status: false,
                message:"Failed to delete the village",
                error:err.message
            });
        }
    }
}

export default crudVillage;