const express = require('express')
const chat_router = express.Router()
const {protect} = require('../middleWare/Authmiddle')
const chatController  = require('../Controller/chatController')
const bodyParser = require('body-parser')

chat_router.use(bodyParser.json())

chat_router.post('/access',protect,chatController.accessChat)
chat_router.get('/',protect,chatController.fetchChat)

chat_router.post('/group',protect,chatController.createGroupChat)
chat_router.put('/rename',protect,chatController.renameGroup)

chat_router.put('/groupadd',protect,chatController.addToGroup)
chat_router.put('/groupremove',protect,chatController.removeFromGroup)
module.exports = chat_router