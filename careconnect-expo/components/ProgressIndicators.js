import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ProgressIndicators({ goals = [] }) {
  const items = goals.length ? goals : [
    { id: 'g1', label: 'This Month Goal', current: 12000, target: 20000 },
    { id: 'g2', label: 'Equipment Fund', current: 5400, target: 10000 },
    { id: 'g3', label: 'Community Outreach', current: 2200, target: 4000 },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Progress</Text>
      {items.map((g) => {
        const pct = Math.min(100, Math.round((g.current / g.target) * 100));
        return (
          <View key={g.id} style={styles.item}>
            <View style={styles.row}>
              <Text style={styles.label}>{g.label}</Text>
              <Text style={styles.percent}>{pct}%</Text>
            </View>
            <View style={styles.barBg}>
              <View style={[styles.barFill, { width: `${pct}%` }]} />
            </View>
            <Text style={styles.meta}>${g.current.toLocaleString()} of ${g.target.toLocaleString()}</Text>
          </View>
        );
      })}
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
  item: { marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { color: '#2d3436' },
  percent: { color: '#636e72' },
  barBg: { height: 10, backgroundColor: '#dfe6e9', borderRadius: 999, overflow: 'hidden', marginTop: 4 },
  barFill: { height: '100%', backgroundColor: '#6c5ce7' },
  meta: { marginTop: 4, color: '#636e72' },
});


