import React from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components/native';
import { store } from './store';
import RootNavigator from './navigation/RootNavigator';
import { lightTheme } from './theme';
import { View } from 'react-native';
import FloatingChat from './components/FloatingChat';

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={lightTheme}>
        <View style={{ flex: 1 }}>
          <RootNavigator />
          <FloatingChat />
        </View>
      </ThemeProvider>
    </Provider>
  );
}