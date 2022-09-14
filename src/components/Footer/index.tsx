import { Link, Stack, Text } from '@chakra-ui/react';
import Icon from '@components/Icon';
import { TwitterIcon, PaperplaneIcon, DiscordIcon } from '@fusion-icons/react/interface';

function Footer() {
  return (
    <>
      <Stack color="grey" direction="row" w="full" spacing={8}>
        <Link target="_blank" href="https://twitter.com/CALC_Finance" rel="noopener noreferrer">
          <Icon as={TwitterIcon} stroke="slateGrey" />
        </Link>
        <Link target="_blank" href="https://twitter.com/CALC_Finance" rel="noopener noreferrer">
          <Icon as={PaperplaneIcon} stroke="slateGrey" />
        </Link>
        <Link target="_blank" href="https://twitter.com/CALC_Finance" rel="noopener noreferrer">
          <Icon as={DiscordIcon} stroke="slateGrey" />
        </Link>
      </Stack>
      <Text fontSize="10px">Proudly built on the Kujira Blockchain.</Text>
    </>
  );
}

export default Footer;
