import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

const layerStyles = {
  panel: {
    bg: 'deepHorizon',
  },
};

const fonts = {
  heading: "'Karla', sans-serif",
  body: "'Karla', sans-serif",
};

const colors = {
  black: '#0f0f12',
  grey: '#A0A0A0',
  slateGrey: '#8B8CA7',
  darkGrey: '#2C2D3A',
  navy: '#1B202B',
  deepHorizon: '#171922',
  abyss: '#191C25',
  green: {
    50: '#e3fdf5',
    100: '#7bf6d1',
    200: '#18e0a4',
    300: '#14bc8a',
    400: '#12a87b',
    500: '#0f8e68',
    600: '#0d7858',
    700: '#0a6047',
    800: '#09523c',
    900: '#063b2b',
  },
  blue: {
    50: '#9CCBF0',
    100: '#9CCBF0',
    200: '#9CCBF0',
    300: '#9CCBF0',
    400: '#9CCBF0',
    500: '#9CCBF0',
    600: '#9CCBF0',
    700: '#9CCBF0',
    800: '#9CCBF0',
    900: '#9CCBF0',
  },
  red: {
    50: '#FF5858',
    100: '#FF5858',
    200: '#FF5858',
    300: '#FF5858',
    400: '#FF5858',
    500: '#FF5858',
    600: '#FF5858',
    700: '#FF5858',
    800: '#FF5858',
    900: '#FF5858',
  },
  brand: {
    50: '#fff6e7',
    100: '#ffdb9d',
    200: '#ffb93d',
    300: '#d89a2e',
    400: '#c18a29',
    500: '#a37422',
    600: '#89621d',
    700: '#6e4f17',
    800: '#5d4314',
    900: '#43300e',
  },
};

const semanticTokens = {};

const components = {
  Button: {
    baseStyle: {
      borderRadius: 'lg',
      fontSize: 'sm',
    },
    defaultProps: {
      colorScheme: 'brand',
      size: 'sm',
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
