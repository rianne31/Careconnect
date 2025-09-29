import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';

const API_URL = 'http://YOUR_BACKEND_URL/api/auctionitems/';

export default function AuctionListScreen({ navigation }) {
  const [auctions, setAuctions] = useState([]);

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const res = await axios.get(API_URL);
        setAuctions(res.data);
      } catch (err) {
        // handle error
      }
    };
    fetchAuctions();
  }, []);

  const getStatus = (item) => {
    const now = new Date();
    const start = new Date(item.start_time);
    const end = new Date(item.end_time);
    if (now < start) return 'Upcoming';
    if (now > end) return 'Ended';
    return 'Active';
  };

  const getCountdown = (item) => {
    const now = new Date();
    const end = new Date(item.end_time);
    const diff = end - now;
    if (diff <= 0) return 'Ended';
    const mins = Math.floor(diff / 60000) % 60;
    const hours = Math.floor(diff / 3600000);
    return `${hours}h ${mins}m left`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Auctions</Text>
        <Text style={styles.description}>
          Browse all ongoing and upcoming auctions. Tap an item to view details and place a bid.
        </Text>
      </View>
      <FlatList
        data={auctions}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('AuctionDetail', { id: item.id })} style={styles.item}>
            <Text style={styles.name}>{item.name}</Text>
            <Text>Status: {getStatus(item)}</Text>
            <Text>Countdown: {getCountdown(item)}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  header: { marginBottom: 16 },
  description: { fontSize: 14, color: '#636e72', marginBottom: 16, textAlign: 'center' },
  title: { fontSize: 24, marginBottom: 16 },
  item: { padding: 16, borderWidth: 1, borderRadius: 8, marginBottom: 12 },
  name: { fontSize: 18, fontWeight: 'bold' },
});
