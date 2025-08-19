import React, { useEffect, useState, useRef } from 'react';
import { View, Text, FlatList, Button, TextInput, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://YOUR_BACKEND_URL/api/auctionitems/';
const WS_URL = 'ws://YOUR_BACKEND_URL/ws/auction/'; // Update with your backend WebSocket URL

export default function AuctionDetailScreen({ route }) {
  const { id } = route.params;
  const [item, setItem] = useState(null);
  const [bids, setBids] = useState([]);
  const [bidAmount, setBidAmount] = useState('');
  const ws = useRef(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await axios.get(`${API_URL}${id}/`);
        setItem(res.data);
        setBids(res.data.bids || []);
      } catch (err) {
        // handle error
      }
    };
    fetchDetails();
  }, [id]);

  // WebSocket for real-time bid updates
  useEffect(() => {
    ws.current = new WebSocket(`${WS_URL}${id}/`);
    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setBids(data.bids); // Adjust if your backend sends a different format
      } catch (e) {}
    };
    ws.current.onerror = () => Alert.alert('Error', 'WebSocket error');
    return () => {
      if (ws.current) ws.current.close();
    };
  }, [id]);

  const handleBid = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      await axios.post(`http://YOUR_BACKEND_URL/api/bids/`, {
        auction_item: id,
        amount: bidAmount,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBidAmount('');
    } catch (err) {
      Alert.alert('Error', 'Failed to place bid');
    }
  };

  if (!item) return <Text>Loading...</Text>;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{item ? item.name : 'Auction Details'}</Text>
        <Text style={styles.description}>
          View item details, bid history, and place your bid below.
        </Text>
      </View>
      <Text>{item.description}</Text>
      <Text>Current Highest Bid: {bids.length > 0 ? bids[0].amount : 'No bids yet'}</Text>
      <TextInput
        style={styles.input}
        placeholder="Your Bid"
        value={bidAmount}
        onChangeText={setBidAmount}
        keyboardType="numeric"
      />
      <Button title="Place Bid" onPress={handleBid} />
      <Text style={styles.subtitle}>Bid History</Text>
      <FlatList
        data={bids}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.bidItem}>
            <Text>{item.user}: {item.amount}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  title: { fontSize: 24, marginBottom: 8 },
  subtitle: { fontSize: 18, marginTop: 24, marginBottom: 8 },
  input: { borderWidth: 1, marginBottom: 12, padding: 8, borderRadius: 4 },
  bidItem: { padding: 8, borderBottomWidth: 1, borderColor: '#eee' },
  header: { marginBottom: 16 },
  description: { fontSize: 14, color: '#636e72', marginBottom: 16, textAlign: 'center' },
});
