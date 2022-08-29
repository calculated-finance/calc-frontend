import { Heading } from "@chakra-ui/react"
import { NextPage } from "next"
import { getSidebarLayout } from "../../components/Layout"
import { NextPageWithLayout } from "../_app"

const Settings: NextPageWithLayout = () => {
  return (
    <Heading>Settings</Heading>
  )
}

Settings.getLayout = getSidebarLayout

export default Settings