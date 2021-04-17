import { useState, useEffect } from 'react'
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalFooter,
  ModalBody,
  InputGroup,
  Input,
  InputRightElement,
  Spinner,
  Text
} from '@chakra-ui/react';

import { gql, useMutation } from '@apollo/client';
import client from "../apollo-client";
import { useAuth } from './context/auth-context';

const LOGIN_USER = gql`
mutation Login_User($username: String!, $password: String!) {
  login(username:$username, password:$password) {
    access_token
  }
}
`;

const Login = ({ handleClick, show, isOpen, onClose }) => {
const { login } = useAuth();
const [userName, setUsername] = useState('')
const [password, setPassword] = useState('')
const [error, setError] = useState({
    username:false,
    password:false,
    message:''
})

const [getUser, {loading}] = useMutation(LOGIN_USER, { client:client });


const handleLogin = async () => {
const lowerCaseUsername = userName.toLowerCase()
const lowerCasePassword = password.toLowerCase()

if(lowerCaseUsername.length !== 0 && lowerCasePassword.length !== 0) {
    try {
        const { data } = await getUser({ variables: { username: lowerCaseUsername, password:lowerCasePassword } })
        setError({
            username:false,
            password:false,
            message:''
        })
        setUsername('')
        setPassword('')
        localStorage.setItem('token', JSON.stringify(data.login.access_token))
        login()
        data && onClose()
    } catch (err) {
         if(err.message.split(' ')[0] === 'PASSWORD') {
             setError({
                 password:true,
                 username:false,
                 message:err.message
             })
         } else if(err.message.split(' ')[0] === 'USERNAME') {
             setError({
                 username:true,
                 password:false,
                 message:err.message
             })
         } 
     } 
} else {
    setError({
        username:true,
        password:true,
        message:'Please, provide the following'
    })
}


}


    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Login</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
         {error.username && <Text color='red.500'  fontSize="sm"> {error.message} </Text>} 
          <InputGroup size="md" my='3'>
            <Input
              defaultValue={userName}
              focusBorderColor="cyan.400"
              isRequired={true}
              onChange={(e) => setUsername(e.target.value) }
              pr="4.5rem"
              type="text"
              placeholder="Username"
              errorBorderColor="red.200"
              isInvalid={error.username === true && true}
            />
          </InputGroup>
         
          {error.password && <Text color='red.500' fontSize="sm"> {error.message} </Text>} 
          <InputGroup size="md"  my='3'>
            <Input
              defaultValue={password}
              focusBorderColor="cyan.400"
              isRequired={true}
              onChange={(e) => setPassword(e.target.value) }
              pr="4.5rem"
              type={show ? "text" : "password"}
              placeholder="Password"
              errorBorderColor="red.200"
              isInvalid={error.password === true && true}
            />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={handleClick}>
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        
          </ModalBody>
        
          <ModalFooter>
            <Button  colorScheme="gray" mr={3} onClick={onClose}>
             Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleLogin}> { loading ?   <Spinner size="xs" /> : 'Submit' }</Button>
          </ModalFooter>
        </ModalContent>
        </Modal>
        
    )
}

export default Login


