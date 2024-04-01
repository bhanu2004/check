import jwt from 'jsonwebtoken'
// import userModel from '../models/User.js'
import User from '../models/user.js'

var checkUserAuth = async (req,res,next) =>{
    try{
        let token 
        const {authorization} = req.headers;
        if(!authorization || !authorization.startsWith('Bearer')) throw new Error("Unauthorized user, no token");
        token = authorization.split(' ')[1]
        const {userID} = jwt.verify(token, process.env.JWT_SECRET_KEY)
        req.user = await User.findOne({where: {id: userID},raw:true})
        // console.log("user auth",req.user);
        next();
    }catch(err){
        console.log(err)
        res.status(401).json({
            status:false,
            message:"authentication failed",
            error:err.message
        })
    }

}


export default checkUserAuth;

