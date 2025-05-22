import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  fonts: {
    heading: "'Inter', sans-serif",
    body: "'Inter', sans-serif",
  },
  colors: {
    primary: {
      50: '#e6f1ff',
      100: '#cce3ff',
      200: '#99c7ff',
      300: '#66aaff',
      400: '#338eff',
      500: '#3B82F6', // primary blue
      600: '#0055cc',
      700: '#004099',
      800: '#002a66',
      900: '#001533',
    },
    accent: {
      50: '#fff2e6',
      100: '#ffe6cc',
      200: '#ffcc99',
      300: '#ffb366',
      400: '#ff9933',
      500: '#F97316', // accent orange
      600: '#cc5200',
      700: '#993d00',
      800: '#662900',
      900: '#331400',
    },
    success: {
      500: '#10B981', // success green
    },
    warning: {
      500: '#F59E0B', // warning yellow
    },
    error: {
      500: '#EF4444', // error red
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: '600',
        borderRadius: 'md',
      },
      variants: {
        solid: {
          bg: 'primary.500',
          color: 'white',
          _hover: {
            bg: 'primary.600',
          },
        },
        outline: {
          borderColor: 'primary.500',
          color: 'primary.500',
          _hover: {
            bg: 'primary.50',
          },
        },
      },
    },
    Card: {
      baseStyle: {
        container: {
          borderRadius: 'lg',
          boxShadow: 'md',
        },
      },
    },
  },
  styles: {
    global: {
      body: {
        bg: 'gray.50',
        color: 'gray.800',
      },
    },
  },
});

export default theme;