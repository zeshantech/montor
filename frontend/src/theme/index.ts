// // src/theme/index.ts

// import { extendTheme, ThemeConfig } from '@chakra-ui/react';

// const config: ThemeConfig = {
//   initialColorMode: 'light',
//   useSystemColorMode: false,
// };

// const theme = extendTheme({ config });

// export default theme;


// src/theme/index.ts

import { extendTheme, ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

const colors = {
  brand: {
    50: '#e3f9e5',
    100: '#c1eac7',
    200: '#a3d9a8',
    300: '#7bc47f',
    400: '#57ae5b',
    500: '#3f9142',
    600: '#2c7833',
    700: '#1e5d26',
    800: '#13361c',
    900: '#0a2410',
  },
};

const fonts = {
  heading: `'Roboto', sans-serif`,
  body: `'Open Sans', sans-serif`,
};

const components = {
  Button: {
    baseStyle: {
      borderRadius: 'md',
    },
    variants: {
      solid: {
        bg: 'brand.500',
        color: 'white',
        _hover: {
          bg: 'brand.600',
        },
      },
      outline: {
        borderColor: 'brand.500',
        color: 'brand.500',
        _hover: {
          bg: 'brand.50',
        },
      },
    },
  },
  // Customize other components as needed
};

const theme = extendTheme({ config, colors, fonts, components });

export default theme;
