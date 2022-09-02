import { Link, Stack, Text } from '@chakra-ui/react';
import Icon from '@components/Icon';
import { TwitterIcon, PaperplaneIcon, DiscordIcon, NightIcon } from '@fusion-icons/react/interface';

function Footer() {
  return (
    <>
      <Stack color="grey" direction="row" w="full" spacing={8}>
        <Link href="https://twitter.com/CALC_Finance">
          <Icon as={TwitterIcon} stroke="slateGrey" />
        </Link>
        <Link href="https://twitter.com/CALC_Finance">
          <Icon as={PaperplaneIcon} stroke="slateGrey" />
        </Link>
        <Link href="https://twitter.com/CALC_Finance">
          <Icon as={DiscordIcon} stroke="slateGrey" />
        </Link>
        <Link href="https://twitter.com/CALC_Finance">
          <Icon as={NightIcon} stroke="slateGrey" />
        </Link>
      </Stack>
      <Text fontSize="10px">Proudly built on the Kujira Blockchain.</Text>
    </>
  );
}

export default Footer;
