import React, { useContext, useState } from 'react'
import { ViewIcon } from '@chakra-ui/icons'
import { Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast } from '@chakra-ui/react'
import axios from 'axios'
import ChatContext from '../../Context/ChatContext'

const InviteFriend = ({user,children}) => {

  const [loading,setLoading] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [email,setEmail] = useState()
  const context = useContext(ChatContext)
  const { searchUsers } = context

  const toast = useToast()

  const sendMail = async () =>{
    try{
      setLoading(true)
      const config = {
        headers:{
          authorization:`Bearer ${user.token}`
        }
      }

      const {data} = await axios.post('/api/message/invite',{
        name:user.name,
        email:email
      },config)

      if(data){
        
        if(data !== searchUsers(email)){
          toast({
            title:"Mail send Successfully",
            status:"success",
            duration:5000,
            isClosable:true,
            position:"bottom"
          })
          setLoading(false)
        }else{
          toast({
            title:"User Exists",
            status:"warning",
            duration:5000,
            isClosable:true,
            position:"bottom"
          })
          setLoading(false)
        }
      }
    }catch(err){
      toast({
        title:"Something went Wrong",
        status:"error",
        duration:5000,
        isClosable:true,
        postion:"bottom"
      })
      setLoading(false)
    }
  }

  return (
    <>
      {
        children? <span onClick={onOpen}>{children}</span>:(
            <IconButton display={{base:"flex"}} icon={<ViewIcon/> } onClick={onOpen} /> 
        )
      }

        <Modal size={'sm'} isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent h={'410px'}>
            <ModalHeader
                fontSize={'40px'}
                fontFamily={"Work sans"}
                display={'flex'}
                justifyContent={'center'}
            >Invite Friend</ModalHeader>
            <ModalCloseButton />
            <ModalBody display={"flex"} flexDir={"column"} alignItems={"center"} justifyContent={"space-between"}>

                <FormControl 
                    display={'flex'}
                >
                    <Input placeholder='Email Of Your Friend' mb={1} onChange={(e)=>setEmail(e.target.value)} />
                    <Button variant={'solid'} colorScheme='teal' ml={1} onClick={sendMail} isLoading={loading} loadingText={"sending"}>Send</Button>
              </FormControl>
               
            </ModalBody>
      
            <ModalFooter>
              <Button colorScheme='blue' mr={3} onClick={onClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
    </>
  )
}

export default InviteFriend
