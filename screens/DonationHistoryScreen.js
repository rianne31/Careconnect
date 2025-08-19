import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://YOUR_BACKEND_URL/api/donations/';

export default function DonationHistoryScreen() {
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    const fetchDonations = async () => {
      const token = await AsyncStorage.getItem('access_token');
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDonations(res.data);
    };
    fetchDonations();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Donation History</Text>
        <Text style={styles.description}>
          Here you can view all your past donations and their details.
        </Text>
      </View>
      <FlatList
        data={donations}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.donationItem}>
            <Text>{item.type === 'money' ? `Money: $${item.amount}` : `Item: ${item.item}`}</Text>
            <Text>Date: {item.date}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  title: { fontSize: 24, marginBottom: 16 },
  donationItem: { padding: 12, borderBottomWidth: 1, borderColor: '#eee' },
  header: { marginBottom: 16 },
  description: { fontSize: 14, color: '#636e72', marginBottom: 16, textAlign: 'center' },
}); 