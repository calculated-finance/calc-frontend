import { Heading } from "@chakra-ui/react"
import { NextPage } from "next"
import { getSidebarLayout } from "../../components/Layout"
import { NextPageWithLayout } from "../_app"

const CreateStrategy: NextPageWithLayout = () => {
  return (
    <Heading>Create Strategy</Heading>
  )
}

CreateStrategy.getLayout = getSidebarLayout

export default CreateStrategy