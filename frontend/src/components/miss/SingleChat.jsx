import React, { useContext, useEffect, useState } from 'react'
import ChatContext from '../../Context/ChatContext'
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react'
import { ArrowBackIcon, ViewIcon } from '@chakra-ui/icons'
import { getSender , getSenderFull } from '../../config/ChatLogics'
import MyProfile from './MyProfile'
import UpdateGroupChat from './UpdateGroupChat'
import axios from 'axios'
import './messages.css'
import ScrollableChat from './ScrollableChat'
import Lottie from 'react-lottie'
import io from 'socket.io-client'
import animationData from '../../asset/typing.json'

const ENDPOINT = "https://chatapp-ccq1.onrender.com"
let socket, selectedChatCompare


const SingleChat = () => {
    const context = useContext(ChatContext)
    const {user,selectedChat , setSelectedchat, notification , setNotification ,setFetchAgain, fetchAgain} = context

    const [messages,setMessage] = useState([])
    const [loading, setLoading] = useState(false)
    const [newMessage,setNewMessage] = useState()
    const [ socketConnected, setSocketConnected ] = useState(false)
    const [typing, setTyping] = useState(false)
    const [ istyping, setIstyping] = useState(false)

    const toast = useToast()

    const defaultOption={
        loop:true,
        autoplay:true,
        animationData: animationData,
        rendererSettings:{
            preserveAspectRatio:"xMidYMid slice"
        }
    }

    useEffect(()=>{
        socket = io(ENDPOINT,{reconnectionAttempts: 5, reconnectionDelay: 1000}  )
        socket.emit("setup",user)
        socket.on('connected',()=> setSocketConnected(true))
        socket.on('typing',()=>setIstyping(true))
        socket.on('stop typing',()=>setIstyping(false))
    },[])


    const fetching = async()=>{
        try {
            if(!selectedChat) return

            setLoading(true)

                const config = {
                    headers:{
                        Authorization:`Bearer ${user.token}`
                    }
                }
    
            const {data} = await axios.get(`/api/message/${selectedChat._id}`,config)


            setMessage(data)
            setLoading(false) 
            
            socket.emit('join chat',selectedChat._id)
        } catch (error) {
            toast({
                title: 'Error Occured!!!',
                description: " Something Went Wrong",
                status: 'error',
                duration: 5000,
                isClosable: true,
            })
        }
    }


    useEffect(()=>{
        fetching()

        selectedChatCompare = selectedChat

        // eslint(react-hooks/exhaustive-deps)
    },[selectedChat])

    useEffect(()=>{
        socket.on('message recieved',(newMessageRecieved)=>{
            if(!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id){
                // give notification
                if(!notification.includes(newMessageRecieved)){
                    setNotification([newMessageRecieved,...notification])
                    setFetchAgain(!fetchAgain)
                }
            }
            else{
                setMessage([...messages,newMessageRecieved])
            }
        })
    })


    
    const sendMessage = async(e) =>{
        if(e.key==='Enter'&& newMessage){
            socket.emit("stop typing",selectedChat._id)
            try {
                const config = {
                    headers:{
                        "Content-type":"application/json",
                        Authorization:`Bearer ${user.token}`
                    }
                }
                
                
                
                const {data} = await  axios.post('/api/message',{
                    content:newMessage,
                    chatId:selectedChat._id
                },config)

                setNewMessage("")
                socket.emit("new message",data)
                setMessage([...messages,data])

                
            } catch (error) {
                toast({
                    title: 'Error Occured!!!',
                    description: " Something Went Wrong",
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                  })
            }
        }
    }

    const typingHandler = (e) =>{
        setNewMessage(e.target.value)

        if(!socketConnected) return 

        if(!typing){
            setTyping(true)
            socket.emit('typing',selectedChat._id)
        }

        let LastTypingTime = new Date().getTime()
        var timerLength = 3000;
        setTimeout(()=>{
            let timeNow = new Date().getTime()
            let timeDiff = timeNow - LastTypingTime
            if(timeDiff >= timerLength && typing){
                socket.emit('stop typing',selectedChat._id)
                setTyping(false)
            }
        },timerLength)
    }

  return (
    <>
      {
        selectedChat?(
            <>
                <Text
                    fontSize={{base:"23px",md:"28px"}}
                    pb={3}
                    px={2}
                    w={"100%"}
                    fontFamily={"Work sans"}
                    display={'flex'}
                    justifyContent={{base:"space-between"}}
                    alignContent={'center'}
                >
                    <IconButton display={{base:"flex",md:"none"}} icon={<ArrowBackIcon/>} onClick={() => setSelectedchat("")} />
                    {
                        !selectedChat.isGroupChat ?(
                            <>
                                {getSender(user,selectedChat.users)}
                                <MyProfile user={getSenderFull(user,selectedChat.users)}>
                                    <IconButton display={"flex"} icon={<ViewIcon/>}  />
                                </MyProfile>
                            </>
                        ):(
                            <>
                                {selectedChat.chatName.toUpperCase()}
                                <UpdateGroupChat />
                            </>
                        )
                    }
                </Text>
                <Box
                    display={'flex'}
                    flexDir={'column'}
                    p={3}
                    bg={"#E8E8E8"}
                    w={"100%"}
                    h={"100%"}
                    borderRadius={'lg'}
                    overflowY={'hidden'}
                >
                    {
                        loading?(
                            <Spinner size={'xl'} thickness='4px'
                            speed='0.65s'
                            emptyColor='gray.200'
                            color='blue.500' w={20} h={20} alignSelf={'center'} margin={'auto'} />
                        ):(
                            <div className='messages'>
                                <ScrollableChat messages={messages}/>
                            </div>
                        )
                    }

                    <FormControl onKeyDown={sendMessage} isRequired mt={'auto'}>
                        {
                            istyping?<div><Lottie
                                options={defaultOption} 
                                width={70}
                                style={{marginBottom:15,marginLeft:0}}
                            /></div>:<></>
                        }
                        <Input 
                            variant={'filled'}
                            bg={'E0E0E0'}
                            placeholder='Enter a Message...'
                            onChange={typingHandler}
                            value={newMessage}
                        />
                    </FormControl>
                </Box>
            </>
        ):(
            <Box display={'flex'} alignItems={"center"} justifyContent={'center'} h={'100%'}>
                <Text fontSize={'3xl'} pb={3} fontFamily={"Work sans"}>
                    Click on user to start chatting
                </Text>
            </Box>
        )
      }
    </>
  )
}

export default SingleChat
