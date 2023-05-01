import { Link, Stack } from '@chakra-ui/react';
import Icon from '@components/Icon';
import { TwitterIcon, DiscordIcon, TelegramIcon } from '@fusion-icons/react/interface';
import { CALC_TELEGRAM_URL } from 'src/constants';

function Footer() {
  return (
    <Stack color="grey" direction="row" w="full" spacing={8}>
      <Link target="_blank" href="https://twitter.com/CALC_Finance" rel="noopener noreferrer">
        <Icon as={TwitterIcon} stroke="slateGrey" />
      </Link>
      <Link target="_blank" href={CALC_TELEGRAM_URL} rel="noopener noreferrer">
        <Icon as={TelegramIcon} stroke="slateGrey" />
      </Link>
      <Link
        target="_blank"
        href="https://discord.com/channels/970650215801569330/999775748879552602"
        rel="noopener noreferrer"
      >
        <Icon as={DiscordIcon} stroke="slateGrey" />
      </Link>
    </Stack>
  );
}

export default Footer;
