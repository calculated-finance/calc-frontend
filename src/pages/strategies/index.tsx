import { Heading } from "@chakra-ui/react"
import { NextPage } from "next"
import { getSidebarLayout } from "../../components/Layout"
import { NextPageWithLayout } from "../_app"

const Strategies: NextPageWithLayout = () => {
  return (
    <Heading>My Strategies</Heading>
  )
}

Strategies.getLayout = getSidebarLayout

export default Strategies