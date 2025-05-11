import React, {useEffect, useState } from 'react'
import ChatContext from './ChatContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const ChatState = ({children}) => {

    
    const [ user, setUser ] = useState({})
    // const [token, setToken] = useState()
    const [selectedChat , setSelectedchat] = useState()
    const [ chats , setChats ] = useState([])
    const [ loggedUser , setLoggedUser ] = useState([])
    const [fetchAgain ,setFetchAgain] = useState(false)
    const navigate = useNavigate()
    const [notification , setNotification] = useState([])


    useEffect(()=>{
        const userInfo =  JSON.parse(localStorage.getItem("user"))
        setUser(userInfo)

        if(!userInfo){
            navigate('/')
        }
    },[setUser,navigate])

    const registeruser = async(name,email,password,pic) =>{
        try{
            const data= {
                name:name,
                email:email,
                password:password,
                pic:pic
            }

            const config = {
                headers:{
                    "Content-Type":"application/json"
                }
            }

            const res = await axios.post('/api/user',data,config)
            const resdata = await res.data
            localStorage.setItem("user",JSON.stringify(resdata))
            return resdata

        }catch(err){
            console.log(err.message)
        }
    }

    const authVerify = async(email,password)=>{

        try {
            const config ={
                headers:{
                    "Content-Type":"application/json"
                }
            }
            const datainfo = {
                email:email,
                password:password
            }
            const {data} = await axios.post('/api/user/login',datainfo,config)
            console.log(data)
            const resData = await data
            localStorage.setItem("user",JSON.stringify(resData))
            return resData

        } catch (error) {
            
        }
    }  

    const searchUsers = async(search) =>{
        try{

            const config = {
                headers:{
                    Authorization:`Bearer ${user.token}`
                }
            }

            const res = await axios.get(`/api/user?search=${search}`,config)
            console.log(res)
            return res

        }catch(err){
            console.log(err)
        }
    }

    const accessChats = async(userId) =>{
        try{
            
            const config = {
                headers:{
                    "Content-type":"application/json",
                    Authorization:`Bearer ${user.token}`
                }
            }

            const {data} = await axios.post(`/api/chat/access`,{userId},config)
            
            return data;

        }catch(error){
            console.log(error)
        }
    }

    

    useEffect(()=>{
        const fetchChats = async() =>{
            try{

            console.log(user.token)

            const config = {
                headers:{
                    Authorization:`Bearer ${user.token}`
                }
            }

            const {data} = await axios.get('/api/chat',config)

            setChats(data)

            }
            catch(err){
                console.log(err.message)
            }
        }

        setLoggedUser(JSON.parse(localStorage.getItem("user")))
        fetchChats()
    },[setLoggedUser,user,fetchAgain ])
    

  return (
    <ChatContext.Provider value={{registeruser,fetchAgain ,notification , setNotification,setFetchAgain, authVerify, user, setUser, searchUsers, accessChats, loggedUser, chats,setChats,selectedChat,setSelectedchat  }}>
        {children}
    </ChatContext.Provider>
  )
}

export default ChatState
