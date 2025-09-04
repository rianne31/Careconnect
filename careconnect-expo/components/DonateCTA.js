import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function DonateCTA({ onDonate }) {
  const donate = (amt) => onDonate?.(amt);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your kindness fuels hope</Text>
      <Text style={styles.subtitle}>100% of your gift supports pediatric cancer care and family aid.</Text>
      <View style={styles.row}>
        {[25, 50, 100].map((amt) => (
          <TouchableOpacity key={amt} style={[styles.btn, styles.ghost]} onPress={() => donate(amt)}>
            <Text style={[styles.btnText, styles.ghostText]}>${amt}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.btn} onPress={() => donate('custom')}>
          <Text style={styles.btnText}>Give a custom amount</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#fffaf0',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#f5d47c',
    marginBottom: 16,
  },
  title: { fontSize: 18, fontWeight: 'bold', color: '#2d3436' },
  subtitle: { color: '#636e72', marginTop: 4, marginBottom: 10 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  btn: {
    backgroundColor: '#6c5ce7',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
  },
  btnText: { color: '#ffffff', fontWeight: '600' },
  ghost: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e3eaf3' },
  ghostText: { color: '#2d3436' },
});


