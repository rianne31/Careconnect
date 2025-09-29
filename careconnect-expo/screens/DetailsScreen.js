import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

export default function DetailsScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Details</Text>
        <Text style={styles.description}>
          This is a sample details page. You can customize this screen to show more information as needed.
        </Text>
      </View>
      <Text>Details Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  header: { marginBottom: 16 },
  title: { fontSize: 24, marginBottom: 16 },
  description: { fontSize: 14, color: '#636e72', marginBottom: 16, textAlign: 'center' },
}); 