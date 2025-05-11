import React, { useEffect } from 'react'
import { Box, Container, Text } from '@chakra-ui/react'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import Login from '../components/Authentication/Login'
import Signup from '../components/Authentication/Signup'
import { useNavigate } from 'react-router-dom'

const Hompage = () => {

    const navigate = useNavigate()

    useEffect(()=>{
        const user = JSON.parse(localStorage.getItem("userInfo"))

        if(user) navigate('/chats')
    })

  return (
    
    <Container maxW='xl' w="100%" centerContent>
        <Box 
            display="flex" 
            justifyContent="center"
            p={2} 
            bg={"white"} 
            w="100%"
            m="4px 0 15px 0" 
            // borderRadius="3xl"
            borderRadius={"lg"}
            borderWidth="1px"
        >
            <Text fontSize="x-large" fontFamily="Work sans" color="black">NChat</Text>
        </Box>
        <Box bg={"white"} w={"100%"} p={4} borderRadius={"lg"} color={'black'} borderWidth={"1px"} >
            <Tabs variant='soft-rounded' >
                <TabList>
                    <Tab width={"50%"}>Login</Tab>
                    <Tab width={"50%"}>SignUp</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <Login />
                    </TabPanel>
                    <TabPanel>
                        <Signup />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Box>
    </Container>
  )
}

export default Hompage
