import { Heading } from "@chakra-ui/react"
import { NextPage } from "next"
import { getSidebarLayout } from "../../components/Layout"
import { NextPageWithLayout } from "../_app"

const HowItWorks: NextPageWithLayout = () => {
  return (
    <Heading>How it works</Heading>
  )
}

HowItWorks.getLayout = getSidebarLayout

export default HowItWorks