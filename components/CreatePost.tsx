import { useState } from 'react'

import { Button } from '@chakra-ui/button'
import { Input } from '@chakra-ui/input'
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay} from '@chakra-ui/modal'
import React from 'react'

import { gql, useMutation } from '@apollo/client';
import client from "../apollo-client";
import { useToast } from '@chakra-ui/toast'
import { Spinner } from '@chakra-ui/spinner'
import { Text } from '@chakra-ui/react'


const ADD_POST = gql`
mutation CreatePost($content:String!){
    createPost(createPostInput:{content:$content}) {
     content
    }
  }
`;


type ErrorMessage = {
    status:boolean;
    message:any;
}
const CreatePost = ({ showAddPostModal,setShowAddPostModal }) => {
    const toast = useToast()
    const [post, setPost] = useState('')
    const [uiError, setError] = useState<ErrorMessage>({
        status:false,
        message:''
    })

    const [getPost, {loading,error}] = useMutation(ADD_POST, { client:client });

    const handlePost = async () => {
        try {
            const { data } = await getPost({variables:{content:post}})
            if(!loading && data.createPost?.content && !error) {
        
                toast({
                    title: 'Post Added',
                    description: "You have succesfully added post",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                    
                })
        setShowAddPostModal(false)
        setPost('')
   }
        } catch (err) {
            if(err) {
                setError({
                    status:true,
                    message: 'Should not be empty'
                })
            }
          
        }

     
    }
    return (
        <Modal isOpen={showAddPostModal} onClose={() => setShowAddPostModal(prev => !prev)} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create your new post </ModalHeader>
        <ModalBody>
        {uiError.status && <Text color='red.500' fontSize="sm" marginBottom={2}> {uiError.message} </Text>} 
            <Input
              defaultValue={post}
              onChange={(e) => setPost(e.target.value) }
              focusBorderColor="cyan.400"
              isRequired={true}
              pr="4.5rem"
              type="text"
              placeholder="Post"
              isInvalid={uiError.status === true && true}

            />
        </ModalBody>
        <ModalFooter>
            <Button  colorScheme="gray" mr={3} onClick={() => setShowAddPostModal(prev => !prev)}>
             Cancel
            </Button>
            <Button colorScheme="blue" onClick={handlePost}> {loading ? <Spinner size="xs" />  : `Create` } </Button>
          </ModalFooter>
        </ModalContent>
        </Modal >
    )
}

export default CreatePost
