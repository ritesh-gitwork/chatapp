import React, { useContext, useState } from 'react'
import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, useToast } from '@chakra-ui/react'
import ChatContext from '../../Context/ChatContext'
import { useNavigate } from 'react-router-dom'

const Login = () => {

    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [show, setShow] = useState(false)
    const [loading, setLoading ] = useState(false)
    const toast = useToast()
    const context = useContext(ChatContext)
    const { authVerify } = context
    const navigate = useNavigate()

    const handleclick = () => setShow(!show)
    const handleSubmit = async() =>{
        setLoading(true)

        if(!email || !password){
            toast({
                title:"Please Select an Image!!",
                status:"warning",
                duration:5000,
                inClosable:true,
                position: "bottom"
            })
            setLoading(false)
            return;
        }

        const login = await authVerify(email,password)
        if(login){
            setLoading(false)
            toast({
                title:"Registeration Successfull!!!",
                status:"success",
                duration:5000,
                inClosable:true,
                position: "bottom"
            })
            navigate('/chats')
            return;
        }else{
            toast({
                title:"SomeThing Went Wrong",
                status:"warning",
                duration:5000,
                inClosable:true,
                position: "bottom"
            })
            setLoading(false)
            return;
        }
        
    }

  return (
    <VStack spacing={"5px"} color={"black"}>
             
        <FormControl id='email' isRequired>
            <FormLabel>Email</FormLabel>
            <Input 
                type='email'
                placeholder='Enter Your Email'
                onChange={(e)=>setEmail(e.target.value)}
            />
        </FormControl>      
        <FormControl id='password' isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
                <Input 
                    type={show?"text" :"password"}
                    placeholder='Enter Your Password'
                    onChange={(e)=>setPassword(e.target.value)}
                />
                <InputRightElement width={"4.5rem"} >
                    <Button h={"1.75rem"} size={"sm"} onClick={()=>handleclick()} >
                        {show ?"Hide" : "Show"}
                    </Button>
                </InputRightElement>
            </InputGroup>
        </FormControl>      
        

        <Button
            colorScheme='blue' 
            width={"100%"}
            style={{marginTop:15}}
            onClick={() => handleSubmit()}
            isLoading={loading}
            loadingText="Wait a Second"
        >
            Login
        </Button> 
        {/* <Button
            variant={"solid"}
            colorScheme='red' 
            width={"100%"}
            style={{marginTop:15}}
            onClick={() => handleSubmit()}
            isLoading={loading}
            loadingText="Wait a Second"
        >
            Get Guest User Credentials
        </Button>  */}
    </VStack>
  )
}

export default Login
