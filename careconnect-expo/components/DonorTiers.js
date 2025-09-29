import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TIERS = [
  { name: 'Bronze', threshold: 50, benefits: ['Thank-you badge'] },
  { name: 'Silver', threshold: 200, benefits: ['Priority updates', 'Silver badge'] },
  { name: 'Gold', threshold: 500, benefits: ['Early access', 'Gold badge', 'Profile highlight'] },
  { name: 'Platinum', threshold: 1000, benefits: ['VIP support', 'Platinum badge', 'Leaderboard boost'] },
];

export default function DonorTiers({ totalDonated = 0 }) {
  const activeTierIndex = TIERS.reduce((idx, tier, i) => (totalDonated >= tier.threshold ? i : idx), -1);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Donor Tier</Text>
      <Text style={styles.subtitle}>Total donated: ${totalDonated}</Text>
      <View style={styles.tiersRow}>
        {TIERS.map((tier, index) => {
          const isActive = index <= activeTierIndex;
          return (
            <View key={tier.name} style={[styles.tierPill, isActive ? styles.tierActive : styles.tierInactive]}>
              <Text style={[styles.tierText, isActive ? styles.tierTextActive : styles.tierTextInactive]}>
                {tier.name}
              </Text>
            </View>
          );
        })}
      </View>
      {activeTierIndex >= 0 && (
        <View style={styles.benefits}>
          <Text style={styles.benefitsTitle}>Benefits</Text>
          {TIERS[activeTierIndex].benefits.map((b) => (
            <Text key={b} style={styles.benefitItem}>• {b}</Text>
          ))}
        </View>
      )}
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
  subtitle: { marginTop: 4, color: '#636e72' },
  tiersRow: { flexDirection: 'row', marginTop: 12, gap: 8, flexWrap: 'wrap' },
  tierPill: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 999 },
  tierActive: { backgroundColor: '#6c5ce7' },
  tierInactive: { backgroundColor: '#dfe6e9' },
  tierText: { fontSize: 12 },
  tierTextActive: { color: '#ffffff', fontWeight: '600' },
  tierTextInactive: { color: '#2d3436' },
  benefits: { marginTop: 12 },
  benefitsTitle: { fontWeight: '600', marginBottom: 4, color: '#2d3436' },
  benefitItem: { color: '#2d3436' },
});


