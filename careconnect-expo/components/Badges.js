import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Badges({ earned = [] }) {
  const allBadges = [
    { id: 'first_donation', label: 'First Donation' },
    { id: 'streak_7', label: '7-Day Streak' },
    { id: 'streak_30', label: '30-Day Streak' },
    { id: 'top_donor', label: 'Top Donor' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Badges</Text>
      <View style={styles.grid}>
        {allBadges.map((b) => {
          const hasIt = earned.includes(b.id);
          return (
            <View key={b.id} style={[styles.badge, hasIt ? styles.badgeActive : styles.badgeInactive]}>
              <Text style={[styles.badgeText, hasIt ? styles.badgeTextActive : styles.badgeTextInactive]}>
                {b.label}
              </Text>
            </View>
          );
        })}
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
  title: { fontSize: 18, fontWeight: 'bold', color: '#2d3436', marginBottom: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  badge: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
  badgeActive: { backgroundColor: '#00b894' },
  badgeInactive: { backgroundColor: '#dfe6e9' },
  badgeText: { fontSize: 12 },
  badgeTextActive: { color: '#ffffff', fontWeight: '600' },
  badgeTextInactive: { color: '#2d3436' },
});


