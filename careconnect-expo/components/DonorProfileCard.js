import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function DonorProfileCard({ tier = 'Silver', total = 275, streakDays = 9, benefits = ['Priority updates', 'Silver badge'] }) {
  const tierStyle = {
    Bronze: styles.badgeBronze,
    Silver: styles.badgeSilver,
    Gold: styles.badgeGold,
    Platinum: styles.badgePlatinum,
  }[tier] || styles.badgeSilver;

  const progressPct = Math.min(100, Math.round((streakDays % 30) / 30 * 100));

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Donor Profile</Text>
        <View style={[styles.badge, tierStyle]}>
          <Text style={styles.badgeText}>{tier}</Text>
        </View>
      </View>
      <Text style={styles.row}><Text style={styles.strong}>Total donated:</Text> ${total}</Text>
      <View style={styles.progressWrap}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progressPct}%` }]} />
        </View>
        <Text style={styles.small}>{streakDays} days streak - Keep it up! Hit 30 days for a badge.</Text>
      </View>
      <Text style={styles.strong}>Benefits:</Text>
      <View style={styles.list}>
        {benefits.map((b) => (
          <Text key={b} style={styles.listItem}>• {b}</Text>
        ))}
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
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  title: { fontSize: 18, fontWeight: '700', color: '#1f2937' },
  badge: { paddingVertical: 5, paddingHorizontal: 10, borderRadius: 20 },
  badgeText: { fontWeight: '600' },
  badgeBronze: { backgroundColor: '#cd7f32' },
  badgeSilver: { backgroundColor: '#c0c0c0' },
  badgeGold: { backgroundColor: '#ffd700' },
  badgePlatinum: { backgroundColor: '#e5e4e2' },
  row: { marginBottom: 10, color: '#1f2937' },
  strong: { fontWeight: '700', color: '#1f2937' },
  progressWrap: { marginBottom: 10 },
  progressBar: { height: 12, backgroundColor: '#e5e7eb', borderRadius: 6, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#2563eb' },
  small: { marginTop: 6, color: '#6b7280' },
  list: { marginTop: 6, gap: 4 },
  listItem: { color: '#374151' },
});


