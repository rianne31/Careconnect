import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const SAMPLE = [
  { id: '1', name: 'Alex', total: 1200 },
  { id: '2', name: 'Sam', total: 950 },
  { id: '3', name: 'Jordan', total: 700 },
  { id: '4', name: 'Taylor', total: 540 },
  { id: '5', name: 'Riley', total: 320 },
];

export default function LeaderboardScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Top Donors</Text>
      <FlatList
        data={SAMPLE}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <View style={styles.row}>
            <Text style={styles.rank}>{index + 1}</Text>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.total}>${item.total}</Text>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f6fa' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12, color: '#2d3436' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
  },
  rank: { width: 28, fontWeight: 'bold', color: '#6c5ce7' },
  name: { flex: 1, marginLeft: 8, color: '#2d3436' },
  total: { fontWeight: '600', color: '#2d3436' },
  sep: { height: 8 },
});


