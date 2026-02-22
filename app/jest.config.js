module.exports = {
  preset: 'react-native',
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|@react-native-firebase|lucide-react-native)/)',
  ],
  setupFilesAfterEnv: ['<rootDir>/jest-setup.js'],
  cacheDirectory: '.jest-cache',
};
