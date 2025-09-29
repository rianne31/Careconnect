module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native|@react-native/js-polyfills|@react-navigation|expo|@expo|expo-modules-core|react-clone-referenced-element|@unimodules|unimodules-.*|sentry-expo|native-base|react-native-svg)'
  ],
};


