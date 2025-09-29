import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import Card from '../components/ui/Card';
import { donationService } from '../services/apiService';

export default function DonorDashboardScreen() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await donationService.getDonations();
        setDonations(Array.isArray(data) ? data : (data?.results ?? []));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const badges = [
    { id: 'first', name: 'First Donation', emoji: '🌟' },
    { id: 'streak', name: 'Weekly Streak', emoji: '🔥' },
    { id: 'impact', name: 'Impact Maker', emoji: '💖' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Donor Dashboard</Text>

      <Card style={{ marginBottom: 16 }}>
        <Text style={styles.sectionTitle}>Badges</Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {badges.map(b => (
            <View key={b.id} style={styles.badge}>
              <Text style={{ fontSize: 18 }}>{b.emoji}</Text>
              <Text style={styles.badgeText}>{b.name}</Text>
            </View>
          ))}
        </View>
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Recent Donations</Text>
        {loading ? (
          <Text>Loading…</Text>
        ) : (
          <FlatList
            data={donations}
            keyExtractor={(i) => String(i.id)}
            renderItem={({ item }) => (
              <View style={styles.row}>
                <Text style={styles.cell}>{item.type === 'inkind' ? 'In-kind' : 'Monetary'}</Text>
                <Text style={styles.cell}>{item.amount ? `$${item.amount}` : '-'}</Text>
                <Text style={styles.cell}>{item.recipient_code || 'N/A'}</Text>
                <Text style={styles.cell}>{new Date(item.created_at || Date.now()).toLocaleDateString()}</Text>
              </View>
            )}
            ListEmptyComponent={<Text style={{ color: '#6b7280' }}>No donations yet.</Text>}
          />
        )}
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6f7fb', padding: 16 },
  title: { fontSize: 24, fontWeight: '800', color: '#111827', marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 8 },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 6, backgroundColor: 'white', borderRadius: 999, borderWidth: 1, borderColor: '#e5e7eb' },
  badgeText: { fontSize: 12, color: '#374151', fontWeight: '600' },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#eef2ff' },
  cell: { width: '25%', color: '#374151', fontSize: 12 },
});


