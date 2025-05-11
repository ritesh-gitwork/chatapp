const jwt = require('jsonwebtoken')
const User = require('../model/UserModal')
const asyncHandler = require('express-async-handler')
const JWT_SECRET = "ALOKBCMCBSDK"

const protect = asyncHandler(async(req,res,next)=>{
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            token = req.headers.authorization.split(" ")[1]
            console.log(token)
            const decoded = jwt.verify(token, JWT_SECRET)
            console.log(decoded)
            req.user = await User.findById(decoded.id).select("-password")

            next()
        } catch (error) {
            res.status(401)
            console.log("Error:->",error)
            throw new Error("Not authorized, token failed")
        }
    }

    if(!token){
        res.status(401)
        throw new Error("Not authorized , no token Found")
    }
})

module.exports = {protect}