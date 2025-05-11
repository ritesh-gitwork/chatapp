import React, { useContext, useState } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    useDisclosure,
    useToast,
    FormControl,
    Input,
    Spinner,
    Box,
  } from '@chakra-ui/react'
import ChatContext from '../../Context/ChatContext'
import axios from 'axios'
import UserListItem from '../UserAvatar/UserListItem'
import UserBadgeItem from '../UserAvatar/UserBadgeItem'



const GroupChatModal = ({children}) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [groupChatName, setGroupChatName] = useState()
    const [selectedUser, setSelectedUser] = useState([])
    const [search, setSearch] = useState()
    const [searchResult, setResult] = useState()
    const [loading, setLoading] = useState(false)

    const toast = useToast()

    const context = useContext(ChatContext)
    const {user, chats, setChats}  = context

    const handleSearch = async (query) =>{
        setSearch(query)
        if(!query){return}

        try {
            setLoading(true)
            const config = {
                headers:{
                    authorization:`Bearer ${user.token}`
                }
            }

            const {data} = await axios.get(`/api/user?search=${search}`,config)
            setLoading(false)
            setResult(data)

        } catch (error) {
            toast({
                title:"Error Occured",
                description:"Failed to load the serach Results",
                status:"error",
                duration:5000,
                isClosable:true,
                position:'bottom-left'
            })
        }
    }

    const handleSubmit = async () =>{
        if(!groupChatName || !selectedUser){
            toast({
                title:"Please fill all the fields",
                status:"warning",
                duration:5000,
                isClosable:true,
                position:"top"
            })
            return
        }

        try {
            
            const config = {
                headers:{
                    "Content-type":"application/json",
                    authorization:`Bearer ${user.token}`
                }
            }

            const { data } = await axios.post("/api/chat/group",{
                name: groupChatName,
                users : JSON.stringify(selectedUser.map((u) => u._id))
             },config)

             setChats([data,...chats])
             onClose()
             toast({
                title:"Group Created successFully",
                status:"success",
                duration:5000,
                isClosable:true,
                position:"bottom"
            })

        } catch (error) {
            
            toast({
                title:"Error Occured",
                description:error.response.data,
                status:"warning",
                duration:5000,
                isClosable:true,
                position:"top"
            })

        }

    }

    const handleGroup = (userToAdd) =>{
        if(selectedUser.includes(userToAdd)){
            toast({
                title:"User already added",
                status:"warning",
                duration:5000,
                isClosable:true,
                position:"top"
            })
            return
        }

        setSelectedUser([...selectedUser,userToAdd])
    }


    const handleDelete = (delUser) =>{
        setSelectedUser(selectedUser.filter(sel=> sel._id !== delUser._id))
    }


    return (
      <>
        <span onClick={onOpen}>{children}</span>
  
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader
                fontSize={'28px'}
                fontFamily={"Work sans"}
                display={'flex'}
                justifyContent={'center'}
            >Create Group Chat</ModalHeader>
            <ModalCloseButton />
            <ModalBody display={'flex'} flexDir={'column'} alignItems={'center'}>
                <FormControl>
                    <Input placeholder='Group Name' mb={3} onChange={(e)=> setGroupChatName(e.target.value)} />
                </FormControl>
                <FormControl>
                    <Input placeholder='Add more than 2 members' mb={1} onChange={(e)=> handleSearch(e.target.value)} />
                </FormControl>
                <Box
                    display={'flex'}
                    flexWrap={'wrap'}
                    alignItems={'left'}
                >

                {selectedUser.map((u)=>(
                    <UserBadgeItem key={u._id} user={u} handleFunction={()=>handleDelete(u)}/>
                ))}
                </Box>
                {
                    loading?<Spinner thickness='4px' speed='0.65s' emptyColor='gray.200' color='blue.500' size='xl' />:(
                        searchResult?.slice(0,4).map((user)=>(
                            <UserListItem key={user._id} user={user} handleFunction={()=>handleGroup(user)} />
                        ))
                    )
                }
            </ModalBody>
  
            <ModalFooter>
              <Button colorScheme='blue' onClick={handleSubmit}>
                Create Chat
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )
}

export default GroupChatModal
