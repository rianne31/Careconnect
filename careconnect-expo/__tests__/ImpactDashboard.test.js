import React from 'react';
import { render } from '@testing-library/react-native';
import ImpactDashboardScreen from '../screens/ImpactDashboardScreen';

describe('ImpactDashboardScreen', () => {
  it('shows allocation, progress and geo sections', () => {
    const { getByText } = render(<ImpactDashboardScreen />);
    expect(getByText('Real-time Fund Allocation')).toBeTruthy();
    expect(getByText('Progress')).toBeTruthy();
    expect(getByText('Geographic Impact')).toBeTruthy();
  });
});


