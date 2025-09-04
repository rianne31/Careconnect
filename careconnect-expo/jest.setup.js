import '@testing-library/jest-native/extend-expect';

// Silence React Native logs
jest.spyOn(global.console, 'error').mockImplementation(() => {});
jest.spyOn(global.console, 'warn').mockImplementation(() => {});

// AsyncStorage mock for tests
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Basic window/crypto shim for RN Web in tests if needed
if (typeof global.crypto === 'undefined') {
  global.crypto = { getRandomValues: (arr) => require('crypto').randomFillSync(arr) };
}

// Mock ethers BrowserProvider in node test env
jest.mock('ethers', () => {
  const actual = jest.requireActual('ethers');
  return {
    ...actual,
    BrowserProvider: function () {
      return {
        send: async () => ['0xabc'],
        getNetwork: async () => ({ chainId: 1 }),
      };
    },
    JsonRpcProvider: function () {
      return {
        getTransactionReceipt: async () => ({ status: 1, blockNumber: 123456 }),
      };
    },
  };
});


