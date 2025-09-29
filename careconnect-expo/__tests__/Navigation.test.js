import React from 'react';
import { render } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import MainTabNavigator from '../navigation/MainTabNavigator';

describe('MainTabNavigator', () => {
  it('renders core tabs', () => {
    const { getAllByText, getByText } = render(
      <NavigationContainer>
        <MainTabNavigator />
      </NavigationContainer>
    );
    expect(getAllByText('Home').length).toBeGreaterThan(0);
    expect(getByText('Auctions')).toBeTruthy();
    expect(getByText('Donate')).toBeTruthy();
    expect(getByText('My Donations')).toBeTruthy();
    expect(getByText('Leaderboard')).toBeTruthy();
    expect(getByText('Impact')).toBeTruthy();
    expect(getByText('Blockchain')).toBeTruthy();
    expect(getByText('AI')).toBeTruthy();
  });
});


