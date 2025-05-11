const asyncHandler = require('express-async-handler')
const User = require('../model/UserModal')
const generateToken = require('../config/generateToken')
const bcrypt = require('bcryptjs')

const securePass = async(password)=>{
    try {
        const passwordHash = await bcrypt.hash(password,10)
        return passwordHash
    } catch (error) {
        console.log(error.message)
    }
}

const registerUser = asyncHandler(async(req,res) =>{
    const { name, email, pic} = req.body
    const password = await securePass(req.body.password)
    if(!name || !email || !password){
        res.status(400)
        throw new Error("Please Enter all the Fields")
    }

    const userExist = await User.findOne({email:email})

    if(userExist){
        res.status(400)
        throw new Error("User already exists")
    }

    const user = await User.create({
        name:name,
        email:email,
        password:password,
        pic:pic
    })

    if(user){
        res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            pic:user.pic,
            token:generateToken(user._id)
        })
    }else{
        res.status(400)
        throw new Error("Failed to Create the User")
    }
})

const passwordMatch= async(password,userpass) =>{
    try{
        const match = await bcrypt.compare(password,userpass)
        return match
    }catch(err){
        console.log(err.message)
    }
}
const authUser = asyncHandler(async(req,res)=>{
    try {
        const {email, password} = req.body

        const user = await User.findOne({email})
        if(user && (await passwordMatch(password,user.password))){
            res.status(201).json({
                _id:user._id,
                name:user.name,
                email:user.email,
                pic:user.pic,
                token:generateToken(user._id)
            })
        }else{
            res.status(400)
            throw new Error("Invalid email and password")
        }
    } catch (error) {
        
    }
})

// api/user?search=navneet
const allUsers = asyncHandler( async (req,res)=>{
    try {
        console.log('entered all users')
        const keyword = req.query.search ? {
            $or: [
                { name: { $regex: req.query.search, $options:"i" }},
                { email: { $regex: req.query.search, $options:"i" }},
            ]
        }:{};
    
        const users = await User.find(keyword).find({_id:{$ne:req.user._id}})
        res.send(users)
    
    } catch (error) {
        console.log(error.message)
    }
    
})

module.exports = {
    registerUser,
    authUser,
    allUsers

}