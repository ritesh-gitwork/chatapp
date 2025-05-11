const expressAsyncHandler = require("express-async-handler");
const Message = require('../model/MessageModal')
const User = require('../model/UserModal')
const Chat = require('../model/chatModels')
const nodemailer = require('nodemailer')
const config = require('../config/config')

const sendInvite = async(name,email)=>{
    try{

        const Transport = nodemailer.createTransport({
            host:"smtp.gmail.com",
            port:587,
            secure:false,
            requireTLS:true,
            auth:{
                user:config.Email,
                pass:config.Password
            }
        })

        const mailoption = {
            from: config.Email,
            to:email,
            subject: `Start Chatting with your friend`,
            html:"<p> Hii,<br>Your friend <b>" + name + "</b> is inviting you to Chat on NChat where you can chat with your friends<a href='https://chatapp-ccq1.onrender.com/'>NChat</a> </p>"
        }

        Transport.sendMail(mailoption,function(error,info){
            if(error){
                console.log(error)
            }else{
                console.log(`email has been send`)
            }
        })

    }catch(err){
        res.status(400)
        throw new Error (err.message)
    }
}

const sendMessage = expressAsyncHandler(async(req,res)=>{

    const { content,chatId } = req.body

    if(!content|| !chatId){
        return res.sendStatus(400)
    }

    let newMessage = {
        sender:req.user._id,
        content:content,
        chat:chatId
    }

    try {
        let message = await Message.create(newMessage)
        message = await message.populate('sender',"name pic")
        message = await message.populate('chat')
        message = await User.populate(message,{
            path:"chat.users",
            select: "name pic email"
        })

        await Chat.findByIdAndUpdate(req.body.chatId,{
            latestMessages:message
        })

        res.json(message)

    } catch (error) {
        res.status(400)
        throw new Error (error.message)
    }

})

const allMessages = expressAsyncHandler(async(req,res)=>{
    try {
        const {chatId} = req.params
    
        const messages = await Message.find({ chat: chatId}).populate('sender',"name pic email").populate('chat')
    
        res.json(messages)
        
    } catch (error) {
        res.status(400)
        throw new Error (error.message)
    }

})

const invite = expressAsyncHandler(async(req,res)=>{
    try{

        const {name,email} = req.body

        await sendInvite(name,email)
        res.sendStatus(200)

    }catch(err){
        res.status(400)
        throw new Error (err.message)
    }
})



module.exports = {
    sendMessage,
    allMessages,
    invite
}