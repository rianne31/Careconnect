import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const INITIAL = [
  { id: 'care', label: 'Patient Care', percent: 40 },
  { id: 'research', label: 'Research', percent: 35 },
  { id: 'ops', label: 'Operations', percent: 15 },
  { id: 'community', label: 'Community', percent: 10 },
];

export default function AllocationTracker() {
  const [allocations, setAllocations] = useState(INITIAL);
  const timerRef = useRef(null);

  useEffect(() => {
    // Simulate real-time drift
    timerRef.current = setInterval(() => {
      setAllocations((prev) => {
        const next = prev.map((item) => ({ ...item }));
        const idx = Math.floor(Math.random() * next.length);
        const delta = (Math.random() - 0.5) * 2; // -1..+1
        next[idx].percent = Math.max(0, Math.min(100, next[idx].percent + delta));
        const total = next.reduce((s, i) => s + i.percent, 0) || 1;
        return next.map((i) => ({ ...i, percent: Math.round((i.percent / total) * 100) }));
      });
    }, 3000);
    return () => clearInterval(timerRef.current);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Real-time Fund Allocation</Text>
      {allocations.map((a) => (
        <View key={a.id} style={styles.row}>
          <Text style={styles.label}>{a.label}</Text>
          <Text style={styles.value}>{a.percent}%</Text>
          <View style={styles.barBg}>
            <View style={[styles.barFill, { width: `${a.percent}%` }]} />
          </View>
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
  row: { marginBottom: 10 },
  label: { color: '#2d3436', marginBottom: 4 },
  value: { position: 'absolute', right: 0, top: 0, color: '#636e72' },
  barBg: { height: 10, backgroundColor: '#dfe6e9', borderRadius: 999, overflow: 'hidden' },
  barFill: { height: '100%', backgroundColor: '#00b894' },
});


