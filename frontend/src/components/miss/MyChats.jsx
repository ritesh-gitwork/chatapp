import React, { useContext} from 'react'
import ChatContext from '../../Context/ChatContext'
import { Box, Button, Stack, Text } from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import ChatLoading from './ChatLoading'
import {getSender} from '../../config/ChatLogics'
import GroupChatModal from './GroupChatModal'

const MyChats = () => {


    const context = useContext(ChatContext)
    const { loggedUser,chats, selectedChat,setSelectedchat  } = context

    // const toast = useToast()

    

    
  return (
    <Box
      display={{base: selectedChat ? "none" :"flex", md:"flex"}}
      flexDir={'column'}
      alignItems={"center"}
      p={3}
      bg={`white`}
      w={{ base:'100%',md:"31%"}}
      borderRadius={"lg"}
      borderWidth={'1px'}
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base:"24px" , md: "26px"}}
        display={"flex"}
        w={"100%"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        My Chats
        <GroupChatModal>
          <Button 
            display={"flex"}
            fontSize={{base:"14px" ,md:"7px", lg:"14px"}}
            rightIcon={<AddIcon/>}
            >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>

      <Box
        display={"flex"}
        flexDir={"column"}
        p={3}
        bg={"#F8F8F8"}
        w={"100%"}
        h={"100%"}
        borderRadius={"lg"}
        overflowY={"hidden"}
      >
        {
          chats ?(
            <Stack overflowY={"scroll"}>
              {
                chats?.map((chat)=>(
                  <Box 
                    onClick={() => setSelectedchat(chat)}
                    cursor={"pointer"}
                    bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                    color={selectedChat === chat ? "white" : "black"}
                    px={3}
                    py={2}
                    borderRadius={"lg"}
                    key={chat._id}
                  >
                    <Text>
                      {!chat.isGroupChat?(
                        getSender(loggedUser, chat.users)
                      ):(chat.chatName)}
                    </Text>
                  </Box>
                ))
              }
            </Stack>
          ) : <ChatLoading/>
        }
      </Box>
    </Box>
  )
}

export default MyChats
