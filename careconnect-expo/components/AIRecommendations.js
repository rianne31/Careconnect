import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AIRecommendations({ recs = [] }) {
  const items = recs.length ? recs : [
    { id: 'r1', text: 'Set a recurring monthly donation to maximize impact.' },
    { id: 'r2', text: 'Support underfunded regions identified in Impact Dashboard.' },
    { id: 'r3', text: 'Bid on auctions aligned with your interests this week.' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AI Recommendations</Text>
      {items.map((r) => (
        <View key={r.id} style={styles.item}>
          <Text style={styles.text}>• {r.text}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    marginBottom: 16,
  },
  title: { fontSize: 18, fontWeight: 'bold', color: '#2d3436', marginBottom: 8 },
  item: { marginBottom: 8 },
  text: { color: '#2d3436' },
});


