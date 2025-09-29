import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Note: This is a placeholder visualization (no map SDK) to keep it lightweight.
// It groups impact by region and shows intensity bars.

export default function GeoImpact({ regions = [] }) {
  const data = regions.length ? regions : [
    { id: 'na', name: 'North America', impact: 62 },
    { id: 'eu', name: 'Europe', impact: 48 },
    { id: 'af', name: 'Africa', impact: 35 },
    { id: 'as', name: 'Asia', impact: 55 },
    { id: 'sa', name: 'South America', impact: 28 },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Geographic Impact</Text>
      {data.map((r) => (
        <View key={r.id} style={styles.row}>
          <Text style={styles.region}>{r.name}</Text>
          <Text style={styles.value}>{r.impact}%</Text>
          <View style={styles.barBg}>
            <View style={[styles.barFill, { width: `${r.impact}%` }]} />
          </View>
        </View>
      ))}
      <Text style={styles.hint}>Higher percentage indicates more beneficiaries reached.</Text>
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
  row: { marginBottom: 10 },
  region: { color: '#2d3436', marginBottom: 4 },
  value: { position: 'absolute', right: 0, top: 0, color: '#636e72' },
  barBg: { height: 10, backgroundColor: '#dfe6e9', borderRadius: 999, overflow: 'hidden' },
  barFill: { height: '100%', backgroundColor: '#fdcb6e' },
  hint: { marginTop: 6, color: '#636e72' },
});


