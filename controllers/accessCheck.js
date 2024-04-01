const accessCheck = (req,res,obj,idName)=>{
    return new Promise (async(resolve, reject)=>{
        try{
            if(!req.body[idName]) reject(`${idName} is missing`);
            const data = await obj.findAll({where:{id:req.body[idName]}})
            if(data[0].dataValues.coordinatorId === req.user[0].dataValues.id){
                 resolve("success");
            } else{
                reject("Unauthorized access!")
            }
    
        }catch(err){
            reject(err)
        }
    })    
}
   
export default accessCheck;
