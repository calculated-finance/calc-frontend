import { Box, Button, ChakraProvider, Flex } from "@chakra-ui/react"
import { ReactElement } from "react"
import theme from "../../theme"
import Sidebar from "../Sidebar"

const AppHeader = () => (
  <Flex p={3} w='full' justifyContent={'end'}>
    <Button variant={'outline'}>
      Connect to a wallet
    </Button>
  </Flex >
)

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider theme={theme}>
      <Sidebar>
        <AppHeader />
        <main>
          <Box maxW="8xl" p={4}>
            {children}
          </Box>
        </main>
      </Sidebar>
    </ChakraProvider >
  )
}

export function getSidebarLayout(page: ReactElement) {
  return (
    <Layout>
      {page}
    </Layout>
  )
}