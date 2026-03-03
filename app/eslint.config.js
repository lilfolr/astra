import reactNativeConfig from '@react-native/eslint-config/flat';
import ftFlowPlugin from 'eslint-plugin-ft-flow';
import globals from 'globals';

export default [
  ...reactNativeConfig.map(config => {
    if (config.plugins && config.plugins['ft-flow']) {
      return {
        ...config,
        plugins: {
          ...config.plugins,
          'ft-flow': ftFlowPlugin,
        },
      };
    }
    return config;
  }),
  {
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },
];
