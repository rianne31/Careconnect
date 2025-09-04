import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function QuickDonateCard({ onDonate }) {
  const donate = (amt) => onDonate?.(amt);
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Quick Donate</Text>
      <Text style={styles.subtitle}>100% of your gift supports pediatric cancer care and family aid.</Text>
      <View style={styles.grid}>
        {[25, 50, 100].map((amt) => (
          <TouchableOpacity key={amt} style={[styles.btn, styles.ghost]} onPress={() => donate(amt)}>
            <Text style={[styles.btnText, styles.ghostText]}>${amt}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.btn} onPress={() => donate('custom')}>
          <Text style={styles.btnText}>Custom Amount</Text>
        </TouchableOpacity>
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
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  btn: { backgroundColor: '#2563eb', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10 },
  btnText: { color: '#ffffff', fontWeight: '600' },
  ghost: { backgroundColor: '#ffffff', borderWidth: 2, borderColor: '#2563eb' },
  ghostText: { color: '#2563eb' },
});


