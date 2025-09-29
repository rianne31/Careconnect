import React from 'react';
import { Button, Text, View, StyleSheet } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to CareConnect</Text>
        <Text style={styles.description}>
          Connecting patients, donors, and healthcare providers seamlessly. Use the menu to navigate through the app.
        </Text>
      </View>
      {/* Navigation buttons removed; now handled by tab navigator */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#f5f6fa',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#2d3436',
  },
  subtitle: {
    fontSize: 16,
    color: '#636e72',
    marginBottom: 32,
    textAlign: 'center',
  },
  header: { marginBottom: 16 },
  description: { fontSize: 14, color: '#636e72', marginBottom: 16, textAlign: 'center' },
}); 