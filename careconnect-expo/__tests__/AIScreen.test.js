import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import AIScreen from '../screens/AIScreen';

describe('AIScreen', () => {
  it('renders prioritized needs and recommendations', () => {
    const { getByText } = render(<AIScreen />);
    expect(getByText('AI-Prioritized Needs')).toBeTruthy();
    expect(getByText('AI Recommendations')).toBeTruthy();
  });

  it('chat assistant accepts input and shows a reply', () => {
    const { getByPlaceholderText, getByText } = render(<AIScreen />);
    const input = getByPlaceholderText('Type a message...');
    fireEvent.changeText(input, 'How do I see impact?');
    fireEvent.press(getByText('Send'));
    expect(getByText(/Impact tab/)).toBeTruthy();
  });
});


