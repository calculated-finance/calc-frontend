import { Button, Icon } from "@chakra-ui/react";
import { FiPlusCircle } from "react-icons/fi";


export function AddRecipientButton() {
  return (
    <Button
      size="xs"
      variant='ghost'
      leftIcon={<Icon as={FiPlusCircle} stroke="brand.200" width={3} height={3} />}
      width={28}
      bgColor='abyss.100'
      fontSize='2xs'
      h={5}
      borderRadius={6}
    >
      Add recipient
    </Button>
  )
}