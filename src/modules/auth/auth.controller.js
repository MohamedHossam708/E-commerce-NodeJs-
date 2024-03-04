import { userModel } from '../../../database/models/user.model.js'
import {asyncHandler} from'../../utils/asyncHandler.js'
import bcryptjs from "bcrypt"
import jwt from 'jsonwebtoken'
import { sendEmail } from '../../utils/sendEmail.js'
import { signUpTemplate } from '../../utils/htmlTemplets.js'
import { tokenModel } from '../../../database/models/tokenModel.js'
import { cartModel } from '../../../database/models/Cart.model.js'




export const SignUp=asyncHandler(async(req,res,next)=>{
    // making sure that the used email dosent exist
    const isUser = await userModel.findOne({email: req.body.email})
    if(isUser){ return next(new Error("User already existed", {cause:409}))}
    // hashing the password
    req.body.password = bcryptjs.hashSync(req.body.password,8)
    // Creating the token
    const token= jwt.sign({email:req.body.email , id:req.body._id  },process.env.SECRET_KEY)
    // Creating the user
   const user = await userModel.create(req.body)
    const html = signUpTemplate(`http:/localhost:3000/auth/activat_account/${token}`,) 
    const messageSent =await sendEmail({
        to: user.email ,
        subject: 'Account Activation',
        html,
        })
    if (!messageSent) return next(new Error("Email is invalid" ,{cause:400}))
    res.status(201).json({sucess:true , message:"User Created , Pleasr activate your account" })
} )


export const activeAccount = asyncHandler(async(req,res,next)=>{
    // receving the token from the params 
    const {token}=req.params
    // decoding the token to get the payload 
    const payLoad = jwt.verify(token,process.env.SECRET_KEY)
    // Searching for the user in DataBase
    const isUser= await userModel.findOneAndUpdate({email:payLoad.email},{confirmEmail:true},{new:true})
    if (!isUser) return res.next(new Error("user is not found",{cause:404})
    )
    // Creating an empty Cart once the user active his account
    await cartModel.create({user:isUser._id})
    res.json({sucess:true , message:"Account Activated , Try to login ",isUser})
})


export const signIn = asyncHandler(async(req,res,next)=>{

    // distructing the req.body
    const { email , password}= req.body
    // searching for the user in database
    const isUser =await userModel.findOne({email})
    if (!isUser)return next(new Error("Invalid Email",{cause:404}))
    // making sure that the user has activated the account
    if (!isUser.confirmEmail) return next(new Error("Please Confirm your email"))
    // comparing the hashed password with the req.body password
    const match = await bcryptjs.compare(password,isUser.password)
    console.log(isUser)
    // sending a response if the passwords dosent match
    if (!match) return next(new Error("Invalid password"))
    // creating a token for using it in authentication and autorization
    const token = jwt.sign({email , id:isUser._id},process.env.SECRET_KEY)
    // saving the token in token model (this an  optional  step)
    await tokenModel.create({token,user:isUser._id})
    // sending the response 
    return res.json({sucess:true ,message:"you are loggedin", token})    

})