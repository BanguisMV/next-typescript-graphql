import React, { useEffect, useState } from 'react'
import { Box, Spacer, Text , Flex, IconButton, useToast, Spinner} from "@chakra-ui/react"
import { DeleteIcon, EditIcon } from "@chakra-ui/icons"
import { useAuth } from "../components/context/auth-context";

import { gql, useMutation, useQuery } from '@apollo/client';
import client from "../apollo-client";

const DELETE_POST = gql`
 mutation DeletePost($id:String!) {
   deletePost(id:$id) {
    message
 }
}
`

const GET_POST = gql`
query Posts {
    posts {
      _id
      content
      author {
        firstName
        _id
      }
    }
  }
`


type DeleteMessage = {
    message:string
}


  
const Posts = () => {
    const {isLoggedIn, id } = useAuth();
    const toast = useToast()
    const [DeletePost] = useMutation(DELETE_POST, { client });
    const {refetch, data, loading, error} = useQuery(GET_POST, { client });


    useEffect(() => {
        refetch()
    },[isLoggedIn])

const handleDelete = async (id:string) => {

    const { data } = await  DeletePost({ variables: {id} })
    const { message }:DeleteMessage = data.deletePost
    await refetch()

    toast({
        title: message,
        description: "You have succesfully deleted the post",
        status: "success",
        duration: 3000,
        isClosable: true,
    })

   
}

     return (
         !loading && data?.posts?.map(post => (
                 <Box w="100%" borderWidth="1px" borderRadius="md" overflow="hidden" p={2} key={post._id} my='3'>
                 <Flex>
                   <Box p="4">
                     <Text fontSize="1xl">  {post.content}</Text>
                       <Spacer />
                     <Text fontSize="1xl"> Author: {post.author._id === id && isLoggedIn ? 'You' : post.author.firstName }</Text>
                   </Box>
             
                   <Spacer />
                     {isLoggedIn && post.author._id === id &&   
                     <Box p="4">
                       <Flex  justifyContent='space-between' alignItems='center'> 

                       <IconButton
                       m='2'
                       colorScheme="orange"
                       aria-label="Edit"
                       size="sm"
                       icon={<EditIcon />}
                       />

                       <IconButton
                       m='2'
                       colorScheme="red"
                       aria-label="Delete"
                       size="sm"
                       onClick={() => handleDelete(post._id)}
                       icon={loading ? <Spinner size="xs" /> : <DeleteIcon />}
                       />     
                     </Flex>
                     </Box> 
                     }
                   </Flex>
             </Box>
        ))
     )
    
}

export default Posts
