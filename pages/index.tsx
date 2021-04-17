import { Text, } from "@chakra-ui/react"
import Posts from "../components/Posts";

export default function Home() {

  return (
    <div>
        <Text fontSize="2xl" textAlign='center' my='4'> Real Time Posts</Text>
        <Posts />
    </div>
  )
}


