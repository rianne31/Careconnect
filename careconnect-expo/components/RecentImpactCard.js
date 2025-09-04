import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function RecentImpactCard({ raised = 18750, goal = 25000 }) {
  const pct = Math.min(100, Math.round((raised / goal) * 100));

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Recent Impact</Text>
      <Text style={styles.subtitle}>Your contributions are making a difference</Text>
      <View style={styles.progressWrap}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${pct}%` }]} />
        </View>
        <Text style={styles.meta}>${raised.toLocaleString()} of ${goal.toLocaleString()} goal reached</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 15,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
  },
  title: { fontSize: 18, fontWeight: '700', color: '#1f2937' },
  subtitle: { color: '#6b7280', marginTop: 6, marginBottom: 10 },
  progressWrap: { marginTop: 6 },
  progressBar: { height: 12, backgroundColor: '#e5e7eb', borderRadius: 6, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#10b981' },
  meta: { marginTop: 8, color: '#1f2937', fontWeight: '600' },
});


