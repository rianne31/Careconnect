import React from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components/native';
import { store } from './store';
import RootNavigator from './navigation/RootNavigator';
import { lightTheme } from './theme';

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={lightTheme}>
        <RootNavigator />
      </ThemeProvider>
    </Provider>
  );
} 