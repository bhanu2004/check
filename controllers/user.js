import User from "../models/user.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mailTransporter from "../config/nodeMailer.js";

class userController {
    static registration = async(req,res)=>{
        try {
            const {name, phone, email,role, password, password_confirmation} = req.body;
            console.log(req.body);
            if(!name || !email || !password || !password_confirmation) throw new Error("Fill all the required fields");
            if(req.user?.role!=='Admin' && role==='Admin') throw new Error("need  admin permission to create an admin account");
            const user = await User.findAll({where:{email:email}, raw:true});
            if(user.length!==0) throw new Error("Email already exists");
            if(password !== password_confirmation) throw new Error("password and confirm password should be same");
    
            const salt = await bcrypt.genSalt(12);
            const hashPassword = await bcrypt.hash(password, salt);
            const newUser = User.build({
                name: name,
                phone:phone,
                role:role,
                email:email,
                password:hashPassword
            })
            await newUser.save();
    
            const saved_user = await User.findOne({where:{email:email},raw:true});
            const token = jwt.sign({userID:saved_user.id},process.env.JWT_SECRET_KEY, {expiresIn: '5d'})
            res.status(201).send({"status":true, "message":"user registered successfully", "token": token});
                    
                
            
        } catch (err) {
            console.log(err);
            res.status(409).json({status:false, message:"failed to register", error:err.message})
        }
    }

    static login = async(req,res)=>{
        try{
            const {email,password} = req.body;
            if(!email || !password) throw new Error("Please enter all fields");

            const user = await User.findOne( {where: {email: email, isDeleted:false}, raw:true});
            if (!user) throw new Error('Invalid credentials');

            const isMatch = await bcrypt.compare(password, user.password)
            if(!isMatch) throw new Error('Invalid Password');

            const token = jwt.sign({userID:user.id},process.env.JWT_SECRET_KEY, {expiresIn: '5d'})
            res.status(200).json({
                status: true,
                message: 'Logged in successfully!',
                id: user.id,  
                username: user.name, 
                isAdmin: user.role === 'Admin',
                role: user.role,
                token:token,
            });
    
        }catch(err){
            console.log(err);
            res.status(401).json({
                status: false,
                message: "failed to login",
                error: err.message
            });
        }
    }

    static forgetPassword = async(req,res)=>{
        try{
    
            const {email} = req.body
            if(email){
                const data = await User.findOne({where:{email:email, isDeleted:false}, raw:true});
                const user = data;
                console.log(user);
                if(!user) throw new Error("email doesn't exists");

                const secret = user.id + process.env.JWT_SECRET_KEY
                const token = jwt.sign({userID: user.id},secret, {expiresIn: '15m'})
                const link = `${process.env.RESET_BASE_URL}/${user.id}/${token}`;
               
                let mailDetails = {
                    from: process.env.EMAIL,
                    to: user.email,
                    subject: 'Password reset link',
                    text: link
                };

            mailTransporter
                .sendMail(mailDetails,
                    function (err, data) {
                        if (err) {
                            console.log(err);
                            console.log('Error Occurs');
                        } else {
                            console.log('Email sent successfully');
                        }
                    });
                console.log(link);
                res.json({status:"success", message:"Password reset email sent... Please check your Email",resetLink:link})
        
               
            }else{
                res.json({status:"failed", message:"All fields are required"})
            }
        }catch(err){
            console.log(err);
            res.json({status:"failed", message:"Something wrong happened"})
        }
    }

    static resetPassword = async(req,res) =>{
        const {password, password_confirmation} = req.body;
        const {id, token} = req.params
        let user = await User.findOne({where:{id:id, isDeleted:false}, raw:true});

        const new_secret = user.id + process.env.JWT_SECRET_KEY
        console.log(new_secret);
        try {
            jwt.verify(token, new_secret);
            console.log("verified");
            if(!password || !password_confirmation) throw "fill all the fields";
            if(password!==password_confirmation) throw "password should be same";

            const salt = await bcrypt.genSalt(12);
            const newHashPassword = await bcrypt.hash(password,salt);
            console.log(newHashPassword);

            await User.update({password:newHashPassword}, {where: {id: id}});
            res.json({
                status:true, 
                message:"password reset succesfully"
            })
                
            
        } catch (err) {
            console.log(err);
            res.status(401).json({
                status:false,
                message: "faild to update password",
                error: err
            })
    
        }
    
    }

    static removeAccount = async(req,res)=>{
        try{
            const {id} =  req.params;
            if (!id ) throw new Error("Missing field in request body");

            const user = await User.findOne({where: {id: id, isDeleted:false},raw: true,});
            if(!user) throw new Error("Can't find the user");
            if(req.user.role !== 'Admin' && req.user.id !== id) throw new Error("You don't have permission for this action");

            await User.update({isDeleted:true}, {where: {id: id}});
            res.status(200).json({
                status: true,
                message:'Successfully deleted the account',
            });
        }catch(err){
            console.log(err);
            res.status(401).json({
                status: false,
                message:"Failed to delete the account",
                error:err
            });
        }
    }

    static fetchUser = async(req,res)=>{
        try{
            const userList = await User.findAll({where: {isDeleted: false},raw: true});
            userList.sort((a,b)=> a.id-b.id);
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

    static updateAccount = async(req,res)=>{
        try{

            if(!req.body.id) throw new Error("User id is missing");
            const user = await User.findOne({where: {id: req.body.id, isDeleted:false},raw: true,});
            if(!user) throw new Error("Can't find the user");

            if(req.user?.role!=='Admin' && req.body.id !== req.user.id) throw new Error("Unauthorized access");
            if(req.user?.role!=='Admin' && req.body.role==='Admin') throw new Error("Unauthorized access");
            if(req.body.password) delete req.body.password;
            console.log("user",user);
            console.log("new",req.body);
            await User.update({...req.body}, {where: {id: req.body.id}});
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
}

export default userController;