import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import BlockchainScreen from '../screens/BlockchainScreen';

describe('BlockchainScreen', () => {
  it('renders wallet and tx status components', () => {
    const { getByText } = render(<BlockchainScreen />);
    expect(getByText('Wallet')).toBeTruthy();
    expect(getByText('Transaction Status')).toBeTruthy();
  });

  it('checks a transaction hash with mocked provider', async () => {
    const { getByPlaceholderText, getByText, findByText } = render(<BlockchainScreen />);
    const input = getByPlaceholderText('Paste transaction hash (0x...)');
    fireEvent.changeText(input, '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
    fireEvent.press(getByText('Check Status'));
    expect(await findByText(/Status: Success/i, {}, { timeout: 5000 })).toBeTruthy();
    expect(await findByText(/Block:/i, {}, { timeout: 5000 })).toBeTruthy();
  });
});


