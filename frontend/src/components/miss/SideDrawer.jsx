import React, { useContext, useState } from 'react'
import {Avatar, Box, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Spinner, Text, Tooltip, useDisclosure, useToast} from '@chakra-ui/react'
import {BellIcon, ChevronDownIcon} from '@chakra-ui/icons'
import ChatContext from '../../Context/ChatContext'
import MyProfile from './MyProfile'
import { useNavigate } from 'react-router-dom'
import ChatLoading from './ChatLoading'
import UserListItem from '../UserAvatar/UserListItem'
import { getSender } from '../../config/ChatLogics'
import InviteFriend from './InviteFriend'

const SideDrawer = () => {

    const [search , setSearch] = useState("")
    const [searchResult , setSearchResult] = useState([])
    const [loading , setLoading] = useState(false)
    const [loadChat , setLoadChat] = useState()

    const context = useContext(ChatContext)
    const { user, searchUsers , accessChats, chats, setChats, setSelectedchat, notification , setNotification,} = context
    const navigate = useNavigate()
    const toast = useToast()

    const { isOpen, onOpen, onClose } = useDisclosure()

    const logoutHandler = () =>{
        localStorage.removeItem("user")
        navigate('/')
    }

    const handleSearch = async() =>{
        if(!search){
            toast({
                title:"Please Enter Something to Search",
                status:"warning",
                duration:5000,
                isClosable:true,
                position:"top-left"
            })
            return;
        }

        try{
            setLoading(true)
            const { data } = await searchUsers(search)
            setLoading(false)
            console.log(data)
            setSearchResult(data)
            console.log(searchResult)
        }catch(err){
            console.log(err)
        }
    }

    const accessChat = async (userId) =>{
        setLoadChat(true)

        const data = await accessChats(userId)        
        if(data){
        
            if( !chats.find((c)=> c._id === data._id)){setChats([data, ...chats])}
            // console.log(chats)


            setSelectedchat(data)
            toast({
                title:"Chat created successfully",
                status:"success",
                duration:5000,
                isClosable:true,
                position:"top-left"
            })
            setLoadChat(false)
            onClose()
        }else{
            toast({
                title:"Something went wrong",
                status:"warning",
                duration:5000,
                isClosable:true,
                position:"top-left"
            })
            setLoadChat(false)
            return;
        }
    }


  return (
    <>
    <Box 
        display="flex"
        justifyContent={"space-between"}
        alignItems={"center"}
        bg={'white'}
        w={'100%'}
        p={"5px 10px 5px 10px "}
    >
        <Tooltip label="Search more Users" hasArrow placement='bottom-end' >
            <Button variant={'ghost'} onClick={onOpen}>
                <i className="fa-solid fa-magnifying-glass"></i>
                <Text d={{base:"none",md:"flex"}} px="4">
                    Search Users
                </Text>
            </Button>
        </Tooltip>

        <Text fontSize={'2xl'} fontFamily={"Work sans"}>
            NChat
        </Text>
        <div>
            <Menu>
                <MenuButton p={1}>
                    <BellIcon fontSize={"2xl"} m={1} />
                </MenuButton>
                <MenuList p={2}>
                    {!notification.length && "No New Message"}
                    {notification.map(notify => (
                        <MenuItem key={notify._id} onClick={()=>{
                            setSelectedchat(notify.chat);
                            setNotification(notification.filter((n) => n !== notify ))
                        }}>
                            {notify.chat.isGroupChat ? `New message in ${notify.chat.chatName}`:`New message from ${getSender(user,notify.chat.users)}`}
                        </MenuItem>
                    ))}
                </MenuList>
            </Menu>
            <Menu>
                <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                    <Avatar size={'sm'} cursor={'pointer'} name={user.name} src={user.pic} />
                </MenuButton>
                <MenuList>
                    <MyProfile user={user}>
                        <MenuItem>My Profile</MenuItem>
                    </MyProfile>
                    <MenuDivider />
                    <InviteFriend user={user}>
                        <MenuItem>Invite Friend</MenuItem>
                    </InviteFriend>
                    <MenuDivider />
                    <MenuItem onClick={logoutHandler}>Log out</MenuItem>
                </MenuList>
            </Menu>

        </div>
    </Box>

    <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay/>
        <DrawerContent>
            <DrawerHeader borderBottomWidth={'1px'}  >Search Users</DrawerHeader>
            <DrawerBody>
                <Box display={"flex"} pb={2}>
                    <Input 
                        placeholder='Find by name or email'
                        mr={2}
                        value={search}
                        onChange={(e)=>setSearch(e.target.value)}
                    />
                    <Button onClick={handleSearch} >Go</Button>
                </Box>
                {
                    loading ? <ChatLoading/> : (
                        searchResult?.map( user =>(
                                <UserListItem
                                    key= {user._id}
                                    user= {user}
                                    handleFunction={() => accessChat(user._id)}
                                />
                            ))
                    )
                }
                {
                    loadChat && <Spinner ml={'auto'} display={'flex'}/>
                }
            </DrawerBody>
        </DrawerContent>
    </Drawer>

    </>      

  )
}

export default SideDrawer
