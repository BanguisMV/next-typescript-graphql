import {
  Flex, 
  Spacer,
  Text,
  Button,
  Avatar, 
  AvatarBadge,  
  WrapItem,
  Wrap,
} from '@chakra-ui/react';
import { useAuth } from './context/auth-context';

const Nav = ({ onOpen,setShowAddPostModal }) => {
  const { username,isLoggedIn, logout } = useAuth();

    return (
        <Flex color="black" marginY='2'>
        {!isLoggedIn && <Text fontSize="2xl">Next-GraphQL</Text> }
        {isLoggedIn && <Wrap>   
            <WrapItem>
              <Avatar name={username}>
                <AvatarBadge boxSize="1.25em" bg={isLoggedIn && "green.500"} />
              </Avatar>
            </WrapItem>
          </Wrap> 
        }
      
        <Spacer />
      
        {!isLoggedIn && <Button colorScheme="gray" mx='2'>  Sign Up     </Button> }  
        {isLoggedIn &&  <Button colorScheme="gray" mx='2' onClick={() => setShowAddPostModal(prev => !prev)}>  Create Post </Button> }  
        {isLoggedIn &&  <Button colorScheme="teal" mx='2'>  My Posts    </Button> }  

        {isLoggedIn ? 
        <Button colorScheme="red" onClick={() => logout()}>Logout</Button> : 
        <Button colorScheme="blue" onClick={onOpen}>Login</Button> }  
      
        </Flex>
    )
}

export default Nav
