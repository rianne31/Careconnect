import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Streak({ days = 0 }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Donation Streak</Text>
      <Text style={styles.count}>{days} day{days === 1 ? '' : 's'}</Text>
      <View style={styles.barBg}>
        <View style={[styles.barFill, { width: `${Math.min(100, (days % 30) / 30 * 100)}%` }]} />
      </View>
      <Text style={styles.hint}>Keep it up! Hit 30 days for a badge.</Text>
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
  count: { marginTop: 4, fontSize: 24, fontWeight: 'bold', color: '#6c5ce7' },
  barBg: { marginTop: 8, height: 10, backgroundColor: '#dfe6e9', borderRadius: 999, overflow: 'hidden' },
  barFill: { height: '100%', backgroundColor: '#6c5ce7' },
  hint: { marginTop: 6, color: '#636e72' },
});


