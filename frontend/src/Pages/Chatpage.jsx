import React, { useContext } from 'react'
import ChatContext from '../Context/ChatContext'
import { Box } from '@chakra-ui/react'
import SideDrawer from '../components/miss/SideDrawer'
import MyChats from '../components/miss/MyChats'
import ChatBox from '../components/miss/ChatBox'

const Chatpage = () => {

  const context = useContext(ChatContext)
  const { user } = context


  return (
    <div style={{width:"100%"}}>
      {user && <SideDrawer/>}
      <Box display="flex" justifyContent="space-between" w='100%' h='91.5vh' p='10px' >
        {user && <MyChats />}
        {user &&( <ChatBox />)}
      </Box>
    </div>
  )
}

export default Chatpage
