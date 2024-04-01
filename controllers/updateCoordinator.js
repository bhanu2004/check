import coordinatorMatcher from "../models/coordinatorMatcher.js";
import District from "../models/district.js";
import User from "../models/user.js";
import Village from "../models/village.js";

class updateCoordinator{
    static stateUpdate = async(req, res) => {
        try{
            
            if(!req.body.coordinatorId || !req.body.stateId) throw new Error("Fill all the fields");

            // permission check ------------------------>
            if(req.user.role!=='Admin') throw new Error("Admin  only can change state coordinator"); 

            // coordinator role check ------------------------>
            const user = await User.findOne({where:{id:req.body.coordinatorId}, raw:true});
            if(!user) throw  new Error("No such user found");
            if(user.role!="State coordinator") throw new Error('This is not a State coordinator account');

            //update or create coordinator ------------------------>
            const checkState = await coordinatorMatcher.findOne({where:{stateId:req.body.stateId}, raw:true});
            if(checkState){
                await coordinatorMatcher.update({coordinatorId:req.body.coordinatorId}, {where: {stateId: req.body.stateId}});
                res.status(200).json({
                    status: true,
                    message: "coordinater successfully updated !!"
                });
            }else{
                const newData = coordinatorMatcher.build({
                    stateId:req.body.stateId,
                    coordinatorId:req.body.coordinatorId
                });
                await newData.save();
                res.status(200).json({
                    status: true,
                    message: "coordinater successfully updated !!"
                });
            }
             
        }catch(err){
            console.log(err);
            res.status(400).json({
                status: "fail",
                message: "Something wrong happened while updating coordinator",
                error: err.message
            });
        }
    }
    static districtUpdate = async(req, res) => {
        try{
            if(!req.body.coordinatorId || !req.body.districtId) throw new Error("Fill all the fields");

            // permission check ------------------------>
            const district = await District.findOne({where:{id:req.body.districtId, isDeleted:false},raw:true});
            const stateCoordinator = await coordinatorMatcher.findOne({where:{stateId:district.stateId}, raw:true});
            if(!req.user.role!=='Admin' && stateCoordinator?.coordinatorId!==req.user.id) throw new Error("unauthorized access");

            // coordinator role check ------------------------>
            const user = await User.findOne({where:{id:req.body.coordinatorId}, raw:true});
            if(!user) throw  new Error("No such user found");
            if(user.role!="District coordinator") throw new Error('This is not a District coordinator account');

            //update or create coordinator ------------------------>
            const checkDistrict = await coordinatorMatcher.findOne({where:{districtId:req.body.districtId}, raw:true});
            if(checkDistrict){     
                await coordinatorMatcher.update({coordinatorId:req.body.coordinatorId}, {where: {districtId: req.body.districtId}});
                res.status(200).json({
                    status: true,
                    message: "coordinater successfully updated"
                });
            }else{
                const newData =  coordinatorMatcher.build({
                    districtId:req.body.districtId,
                    coordinatorId:req.body.coordinatorId
                });
                await newData.save();

                res.status(200).json({
                    status: true,
                    message: "coordinater successfully updated"
                });
            }
             
        }catch(err){
            console.log(err);
            res.status(400).json({
                status: "fail",
                message: "Something wrong happened while updating coordinator",
                error: err.message
            });
        }
    }

    static villageUpdate = async(req, res) => {
        try{
            if(!req.body.coordinatorId || !req.body.villageId) throw new Error("Fill all the fields");

            // permission check -------------------->
            const village = await Village.findOne({where:{id:req.body.villageId, isDeleted:false},raw:true});
            const districtCoordinator = await coordinatorMatcher.findOne({where:{districtId:village.districtId}, raw:true});
            if(!req.user.role!=='Admin' && districtCoordinator?.coordinatorId!==req.user.id) throw new Error("unauthorized access");

            // coordinator role check ------------------------>
            const user = await User.findOne({where:{id:req.body.coordinatorId}, raw:true});
            if(!user) throw new Error("No such user found");
            if(user.role!="Village coordinator") throw new Error('This is not a Village coordinator account');

            //update or create coordinator ------------------------>
            const checkVillage = await coordinatorMatcher.findOne({where:{villageId:req.body.villageId}, raw:true});
            if(checkVillage){    
                await coordinatorMatcher.update({coordinatorId:req.body.coordinatorId}, {where: {villageId: req.body.villageId}});
                res.status(200).json({
                    status: true,
                    message: "coordinater successfully updated"
                });
            }else{
                const newData =  coordinatorMatcher.build({
                    villageId:req.body.villageId,
                    coordinatorId:req.body.coordinatorId
                });
                await newData.save();

                res.status(200).json({
                    status: true,
                    message: "coordinater successfully updated"
                });
            }
             
        }catch(err){
            console.log(err);
            res.status(400).json({
                status: "fail",
                message: "Something wrong happened while updating coordinator",
                error: err.message
            });
        }
    }
}
export default updateCoordinator;