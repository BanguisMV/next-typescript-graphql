import { Fragment, useState,ReactNode } from 'react'
import { AppProps } from 'next/app';

import { ChakraProvider,
  CSSReset, 
  Container,
  useDisclosure,
} from '@chakra-ui/react';


import LoginModal from '../components/Login'
import AddPostModal from '../components/CreatePost'

import Nav from '../components/Nav'
import { AuthProvider } from '../components/context/auth-context';

function MyApp({ Component, pageProps }: AppProps):ReactNode {

  const { isOpen, onOpen, onClose } = useDisclosure()

  const [show, setShow] = useState(false)
  const handleClick = () => setShow(!show)
  const [showAddPostModal, setShowAddPostModal] = useState(false)

  return(  
  <Fragment>
  <ChakraProvider>
  <CSSReset />

<AuthProvider>



  <Container maxW="container.md" borderRadius="md" borderWidth="1px" p={2} my={2}>
      <Nav  onOpen={onOpen} setShowAddPostModal={setShowAddPostModal} />
      <Component {...pageProps} />
  </Container>


  <LoginModal 
    handleClick={handleClick} 
    show={show} 
    isOpen={isOpen} 
    onClose={onClose}     
    />
<AddPostModal
 setShowAddPostModal={setShowAddPostModal}
 showAddPostModal={showAddPostModal}
/>


</AuthProvider>

</ChakraProvider>
</Fragment>

  )
}

export default MyApp
