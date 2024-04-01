var checkAdminAuth = async (req,res,next) =>{
    try{
        // console.log("user",req.user)
        if(req.user?.role === 'Admin') next();
        else throw new Error("don't have admin access");
        
    }catch(err){
        console.log(err)
        res.status(401).json({
            status:false,
            message:"authentication failed",
            error:err.message
        })
    }
    
        
    
}

export default checkAdminAuth;