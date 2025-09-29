import React from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components/native';
import { store } from './store';
import RootNavigator from './navigation/RootNavigator';
import { lightTheme } from './theme';
import { View, Text } from 'react-native';
import FloatingChat from './components/FloatingChat';

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={lightTheme}>
        <View style={{ flex: 1 }}>
          <RootNavigator />
          <FloatingChat />
          {/* Updated Interface Indicator */}
          <View style={{ position: 'absolute', top: 10, right: 10, backgroundColor: '#10b981', padding: 4, borderRadius: 4 }}>
            <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>UPDATED v2.0</Text>
          </View>
        </View>
      </ThemeProvider>
    </Provider>
  );
}