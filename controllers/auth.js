const user = require("../models/user");
const jwt = require("jsonwebtoken")
const { JWT_SECRET} = require("../config");
const account = require("../models/balance");
require("dotenv").config();


exports.signup = async (req,res) => {
    try {
        const {email , firstName , lastName , password} = req.body;

        if (!email || !firstName || !lastName || !password) {
            return res.json({
                msg:"all fields required"
            })
        }

        const excitingUser = await user.findOne({email});
        if (excitingUser) {
            return res.status(500).json({
                success:false,
                msg:"user already exists"
            })
        }

                

        const newUser = await user.create({
            email:email,
            firstName:firstName,
            lastName:lastName,
            password:password
        })

        const userId = newUser._id;

        await account.create({
            userId,
            balance : 1 + Math.random()* 10000
        })

        const token = jwt.sign({userId}, JWT_SECRET);
        console.log(token)

        res.json({
            msg:"user created successfuly",
            token:token
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success:false,
            msg:"error aya"
        })
    }
}


exports.login = async (req , res ) =>{
   try {
      const {email , password} = req.body

      if (!email || !password) {
       return res.status(404).json({
        message:"fill all details"
       }) 
      }

      let User = await user.findOne({email})

      if (!User) {
        return res.status(404).json({
            success:false,
            message:"please signup firstly"
        })
      }

      if(await bcrypt.compare(password , User.password)){
        
        User.password = undefined;

        res.cookie("User" , token).json({
            message:"User logged in Successfully",
            success:true
        })
      } else {
        console.log('Error In Comparing Password');
        return res.status(500).json({
          success: false,
           message:'pasasword does not match'
   });
      }
   } 
   catch (error) {
    console.log(error);
         return res.status(500).json({
             success:false,
             message:"kuch gadbad hai"
         });
   } 
}