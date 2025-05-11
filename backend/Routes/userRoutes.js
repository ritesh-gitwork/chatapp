const express = require('express')
const userRouter = express.Router()
const userController = require('../Controller/userController')
const { protect } = require('../middleWare/Authmiddle')

userRouter.post('/',userController.registerUser)
userRouter.post('/login',userController.authUser)

userRouter.get('/',protect,userController.allUsers)

module.exports = userRouter
