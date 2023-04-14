import { extendTheme, type ThemeConfig, Popover, PopoverProps } from '@chakra-ui/react';
import { Chains } from '@hooks/useChain';
import colors from './colors';
import components from './components';
import layerStyles from './layerStyles';
import textStyles from './textStyles';
import { osmosisColors } from './osmosisColors';

// hack to get datepicker popup to not highlight input on close
// highlighting caused radio inputs to be buggy until you unfocus
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore-next-line
Popover.defaultProps = {
  returnFocusOnClose: false,
} as PopoverProps;

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

const fonts = {
  heading: "'Karla', sans-serif",
  body: "'Karla', sans-serif",
};

const semanticTokens = {};

const shadows = {
  content: '-4px 0px 20px 4px rgba(0, 0, 0, 0.25)',
  deepHorizon: '0px 4px 4px rgba(18, 18, 19, 0.6)',
  // vignette: 'inset 0 0 30px 40px var(--chakra-colors-navy)',
};

const theme = (chain: Chains) => {
  console.log(chain);
  return extendTheme({
    config,
    layerStyles,
    fonts,
    components,
    colors: chain === Chains.Osmosis ? osmosisColors : colors,
    shadows,
    semanticTokens,
    textStyles,
  });
};

export default theme;
