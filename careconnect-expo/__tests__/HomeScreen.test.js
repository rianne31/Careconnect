import React from 'react';
import { render } from '@testing-library/react-native';
import HomeScreen from '../screens/HomeScreen';

describe('HomeScreen', () => {
  it('renders donor tiers, badges, streak, and recommendations', () => {
    const { getByText } = render(<HomeScreen />);
    expect(getByText('Donor Tier')).toBeTruthy();
    expect(getByText('Badges')).toBeTruthy();
    expect(getByText('Donation Streak')).toBeTruthy();
    expect(getByText(/here are suggestions/i)).toBeTruthy();
  });
});


