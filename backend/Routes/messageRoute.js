const express = require('express')
const messageRouter = express.Router()
const messageController = require('../Controller/messageController')
const {protect} = require('../middleWare/Authmiddle')


messageRouter.post('/',protect,messageController.sendMessage)
messageRouter.get('/:chatId',protect,messageController.allMessages)
messageRouter.post('/invite',protect,messageController.invite)


module.exports = messageRouter