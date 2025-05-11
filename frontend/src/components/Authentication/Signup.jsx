import React, { useState,useContext } from 'react'
import { Button, FormControl, useToast, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import ChatContext from '../../Context/ChatContext'
import { useNavigate } from 'react-router-dom'

const Signup = () => {
    const [name,setName] = useState()
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [confirmpassword, setConfirmpassword] = useState()
    const [pic , setPic] = useState()
    const [show, setShow] = useState(false)
    const [loading , setLoading] = useState(false)
    const toast = useToast()

    const context = useContext(ChatContext)
    const { registeruser } = context
    const navigate = useNavigate()

    const handleclick = () => setShow(!show)
    const postDetails = (pics) => {
        setLoading(true)
        if(pics === undefined){
            toast({
                title:"Please Select an Image!!",
                status:"warning",
                duration:5000,
                inClosable:true,
                position: "bottom"
            })
            return;
        }

        if(pics.type === "image/jpeg" || pics.type === "image/png"){
            const data = new FormData()
            data.append('file',pics)
            data.append("upload_preset","Chat-app")
            data.append("cloud_name","dfr6qnt6a")
            fetch("https://api.cloudinary.com/v1_1/dfr6qnt6a/image/upload",{
                method:"post",
                body:data
            }).then((res)=> res.json())
            .then(data=>{
                setPic(data.url.toString())
                setLoading(false)
            }).catch((err)=>{
                console.log(err)
                setLoading(false)
            })
        }else{
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
    }
    const handleSubmit = async() =>{
        setLoading(true)

        if(!name|| !email || !password){
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
        if(password !== confirmpassword){
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
        const register = await registeruser(name,email,password,pic)
        if(register){
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
        <FormControl id='first-name' isRequired>
            <FormLabel>Name</FormLabel>    
            <Input 
                type='text'
                placeholder='Enter Your Name'
                onChange={(e)=>setName(e.target.value)}
            />
        </FormControl>      
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
        <FormControl id='Confirmpassword' isRequired>
            <FormLabel>Confirm Password</FormLabel>
            <InputGroup>
                <Input 
                    type={show?"text" :"password"}
                    placeholder='Confirm Password'
                    onChange={(e)=>setConfirmpassword(e.target.value)}
                />
                <InputRightElement width={"4.5rem"} >
                    <Button h={"1.75rem"} size={"sm"} onClick={()=>handleclick()} >
                        {show ?"Hide" : "Show"}
                    </Button>
                </InputRightElement>
            </InputGroup>
        </FormControl>     
        <FormControl id='pic' isRequired>
            <FormLabel>Upload Your Picture</FormLabel>
                <Input 
                    type="file"
                    p={1.5}
                    accept='image/*'
                    onChange={(e)=>postDetails(e.target.files[0])}
                />
        </FormControl>    

        <Button
            colorScheme='blue' 
            width={"100%"}
            style={{marginTop:15}}
            onClick={() => handleSubmit()}
            isLoading = {loading}
            loadingText= "Uploading image"
        >
            SignUp    
        </Button> 
    </VStack>
  )
}

export default Signup
