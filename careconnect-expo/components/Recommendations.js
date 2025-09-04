import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Recommendations({ name = 'Donor', nextGoal = 50, suggestedAuctions = [] }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hi {name}, here are suggestions</Text>
      <Text style={styles.hint}>Donate ${nextGoal} to reach your next tier.</Text>
      <View style={styles.list}>
        {suggestedAuctions.length === 0 ? (
          <Text style={styles.item}>No suggestions right now. Check back soon!</Text>
        ) : (
          suggestedAuctions.map((a) => (
            <Text key={a.id} style={styles.item}>• {a.title}</Text>
          ))
        )}
      </View>
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
  title: { fontSize: 18, fontWeight: 'bold', color: '#2d3436' },
  hint: { marginTop: 4, color: '#636e72' },
  list: { marginTop: 8 },
  item: { color: '#2d3436', marginBottom: 4 },
});


