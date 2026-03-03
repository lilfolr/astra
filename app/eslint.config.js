import reactNativeConfig from '@react-native/eslint-config/flat';
import globals from 'globals';

export default [
  ...reactNativeConfig,
  {
    rules: {
      'ft-flow/define-flow-type': 'off',
      'ft-flow/use-flow-type': 'off',
    },
  },
  {
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },
];
