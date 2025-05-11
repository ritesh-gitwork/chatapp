import React, { useContext, useState } from 'react'
import ChatContext from '../../Context/ChatContext'
import { Box, Button, FormControl, IconButton, Input, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
  } from '@chakra-ui/react'
import { ViewIcon } from '@chakra-ui/icons'
import UserBadgeItem from '../UserAvatar/UserBadgeItem'
import UserListItem from '../UserAvatar/UserListItem'
import axios from 'axios'


const UpdateGroupChat = () => {

    const  context = useContext(ChatContext)
    const {fetchAgain , fetchMessages ,setFetchAgain,selectedChat,setSelectedchat ,user} = context

    const [groupChatName, setGroupChatName] = useState()
    const [search, setSearch] = useState("")
    const [searchResult, setSearchresult] = useState([])
    const [loading,setLoading] = useState(false)
    const [renameloading, setRenameLoading] = useState(false)

    const toast = useToast()

    const { isOpen, onOpen, onClose } = useDisclosure()

    const handleRemove = async(user1) =>{
        if(selectedChat.groupAdmin._id !== user._id && user1._id !== user._id){
            toast({
                title:"Only Group Admin can remove someone!!!",
                status:"error",
                duration:5000,
                isClosable:true,
                position:"bottom"
            })
            return
        }

        try {
            setLoading(true)
            const config = {
                headers:{
                    Authorization:`Bearer ${user.token}`
                }
            }

            const {data} = await axios.put('/api/chat/groupremove',{
                chatId:selectedChat._id,
                userId:user1._id
            },config)

            user1._id === user._id ? setSelectedchat() : setSelectedchat(data)
            setFetchAgain(!fetchAgain)
            fetchMessages();
            setLoading(false)

        } catch (error) {
            
        }

    }

    const handleRename = async() =>{
        if(!groupChatName){
            toast({
                title:"chatname empty",
                status:"error",
                duration:5000,
                isClosable:true,
                position:"bottom"
            })
            return
        }

        try {
            setRenameLoading(true)

            const config = {
                headers:{
                    authorization:`Bearer ${user.token}`
                }
            }

            const { data } = await axios.put('http://localhost:5000/api/chat/rename',{
                chatId:selectedChat._id,
                chatName:groupChatName
            },config)
            
            setSelectedchat(data)
            setFetchAgain(!fetchAgain)
            setRenameLoading(false)

        } catch (error) {
            console.log(error)
            toast({
                title:"Error Occurred",
                description:error.response.data.message,
                status:"error",
                duration:5000,
                isClosable:true,
                position:"bottom"
            })
            setRenameLoading(false)
        }
        setGroupChatName("")
    }

    const handleSearch = async(query) =>{
        setSearch(query)
        if(!query){
            return;
        }

        try {
            setLoading(true)
            const config  = {
                headers:{
                    Authorization:`Bearer ${user.token}`
                }
            }

            const {data} = await axios.get(`/api/user?search=${query}`,config)
            setLoading(false)
            setSearchresult(data)
        } catch (error) {
            toast({
                title:"Error Occured!!",
                description:'Failed to search user',
                status:"error",
                duration:5000,
                isClosable:true,
                position:"bottom-left"
            })
        }

    }

    const handleAddUser = async(user1) =>{
        if(selectedChat.users.find((u)=> u._id === user1._id)){
            toast({
                title:"User Already in the group",
                status:"error",
                duration:5000,
                isClosable:true,
                position:'bottom'
            })
            return
        }

        if(selectedChat.groupAdmin._id !== user._id){
            toast({
                title:"Only admin can add someone!!!",
                status:"error",
                duration:5000,
                isClosable:true,
                position:'bottom'
            })
            return
        }

        try {
            setLoading(true)
            const config={
                headers:{
                    Authorization:`Bearer ${user.token}`
                }
            }

            const {data} = await axios.put('/api/chat/groupadd',{
                chatId: selectedChat._id,
                userId:user1._id
            },config)

            setSelectedchat(data)
            setFetchAgain(!fetchAgain)
            setLoading(false)
        } catch (error) {
            toast({
                title:"Error Occured!!",
                description:'Failed add user',
                status:"error",
                duration:5000,
                isClosable:true,
                position:"bottom-left"
            })
        }

    }


    return (
      <>
        <IconButton display={{base:'flex'}} icon={<ViewIcon/>} onClick={onOpen} />
  
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader
                fontSize={'28px'}
                fontFamily={'Work sans'}
                display={'flex'}
                justifyContent={'center'}
            >{selectedChat.chatName}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>

                <Box
                    display={'flex'}
                    w={'100%'}
                    flexWrap={'wrap'}
                    pb={3}
                >
                    {selectedChat.users.map((u)=>(
                        <UserBadgeItem key={user._id} user={u} handleFunction={()=>handleRemove(u)}/>
                    ))}
                </Box>
                <FormControl 
                    display={'flex'}
                >
                    <Input placeholder='Chat name' mb={3} value={groupChatName} onChange={(e)=> setGroupChatName(e.target.value)} />
                    <Button variant={'solid'} colorScheme='teal' ml={1} isLoading={renameloading} onClick={handleRename}>Update</Button>
                </FormControl>
                <FormControl>
                    <Input 
                        placeholder='Add User to group'
                        mb={1}
                        onChange={(e)=> handleSearch(e.target.value)}
                    />
                </FormControl>
                {
                    loading ? (
                        <Spinner size="lg"/>
                    ):(
                        searchResult?.map((user)=>(
                            <UserListItem
                                key={user._id}
                                user={user}
                                handleFunction={()=>handleAddUser(user)}
                            />
                        ))
                    )
                }
            </ModalBody>
  
            <ModalFooter>
              <Button colorScheme='red' onClick={(user)=> handleRemove(user)}>
                Leave Group
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )
}

export default UpdateGroupChat
