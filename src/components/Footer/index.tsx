import { Link, Stack } from '@chakra-ui/react';
import Icon from '@components/Icon';
import { TwitterIcon, DiscordIcon, TelegramIcon, GithubIcon } from '@fusion-icons/react/interface';
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
      <Link target="_blank" href="https://discord.gg/bJDj3zJhDH" rel="noopener noreferrer">
        <Icon as={DiscordIcon} stroke="slateGrey" />
      </Link>
      <Link target="_blank" href="https://github.com/calculated-finance" rel="noopener noreferrer">
        <Icon as={GithubIcon} stroke="slateGrey" />
      </Link>
    </Stack>
  );
}

export default Footer;
