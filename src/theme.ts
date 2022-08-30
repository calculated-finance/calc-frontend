import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

const layerStyles = {
  panel: {
    bg: 'gray.900',
    color: 'gray.200',
  },
};

const fonts = {
  heading: "'Karla', sans-serif",
  body: "'Karla', sans-serif",
};

const colors = {
  yellow: {
    100: '#FFB636',
    200: '#FFB636',
    300: '#FFB636',
    400: '#FFB636',
    500: '#FFB636',
    600: '#FFB636',
    700: '#FFB636',
    800: '#FFB636',
    900: '#FFB636',
  },
};

const semanticTokens = {};

const components = {
  Button: {
    baseStyle: {
      borderRadius: 4,
    },
    defaultProps: {
      colorScheme: 'yellow',
    },
  },
};

const theme = extendTheme({
  config,
  layerStyles,
  fonts,
  components,
  colors,
  semanticTokens,
});

export default theme;
