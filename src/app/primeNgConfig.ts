import { definePreset } from '@primeng/themes';
import Aura from '@primeng/themes/aura';

export const primeNgDefaultPreset = definePreset(Aura, {
  components: {
    button: {
      colorScheme: {
        light: {
          root: {
            primary: {
              background: '{cimdata.500}',
              hoverBackground: '{cimdata.600}',
              activeBackground: '{cimdata.700}',
              borderColor: '{cimdata.500}',
              hoverBorderColor: '{cimdata.600}',
              activeBorderColor: '{cimdata.700}',
              color: '#ffffff',
              hoverColor: '#ffffff',
              activeColor: '#ffffff',
              focusRing: {
                color: '{cimdata.500}',
                shadow: 'none'
              }
            },
          }
        }
      }
    }
  },
  semantic: {
    primary: {
      50: '{slate.50}',
      100: '{slate.100}',
      200: '{slate.200}',
      300: '{slate.300}',
      400: '{slate.400}',
      500: '{slate.500}',
      600: '{slate.600}',
      700: '{slate.700}',
      800: '{slate.800}',
      900: '{slate.900}',
      950: '{slate.950}'
    },

    cimdata: {
      50: '{rose.50}',
      100: '{rose.100}',
      200: '{rose.200}',
      300: '{rose.300}',
      400: '{rose.400}',
      500: '{rose.500}',
      600: '{rose.600}',
      700: '{rose.700}',
      800: '{rose.800}',
      900: '{rose.900}',
      950: '{rose.950}'
    }
  }
});
