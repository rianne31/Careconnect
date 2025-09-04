import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import AIPrioritizedNeeds from '../components/AIPrioritizedNeeds';
import AIRecommendations from '../components/AIRecommendations';

export default function AIScreen({ navigation }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>AI Insights</Text>
        <Text style={styles.subtitle}>Prioritized needs and personalized recommendations</Text>
      </View>
      <AIPrioritizedNeeds />
      <AIRecommendations />
      
      <TouchableOpacity
        style={styles.backToHomeButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.backToHomeText}>← Back to Home</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#f5f6fa' },
  header: { marginBottom: 8 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#2d3436' },
  subtitle: { color: '#636e72', marginTop: 4 },
  backToHomeButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    alignItems: 'center',
  },
  backToHomeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3b82f6',
  },
});


