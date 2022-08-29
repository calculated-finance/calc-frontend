import { Heading } from "@chakra-ui/react"
import { NextPage } from "next"
import { getSidebarLayout } from "../../components/Layout"
import { NextPageWithLayout } from "../_app"

const Performance: NextPageWithLayout = () => {
  return (
    <Heading>Performance</Heading>
  )
}

Performance.getLayout = getSidebarLayout

export default Performance