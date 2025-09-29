import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, TextInput, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://YOUR_BACKEND_URL/api/auctionitems/';

export default function AuctionManagementScreen() {
  const [auctions, setAuctions] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const token = await AsyncStorage.getItem('access_token');
        const res = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAuctions(res.data);
      } catch (err) {
        // handle error
      }
    };
    fetchAuctions();
  }, []);

  const handleCreateOrUpdate = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      const data = { name, description, start_time: startTime, end_time: endTime };
      if (editingId) {
        await axios.put(`${API_URL}${editingId}/`, data, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(API_URL, data, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setName(''); setDescription(''); setStartTime(''); setEndTime(''); setEditingId(null);
      // Refresh list
      const res = await axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } });
      setAuctions(res.data);
    } catch (err) {
      Alert.alert('Error', 'Failed to save auction');
    }
  };

  const handleEdit = (auction) => {
    setName(auction.name);
    setDescription(auction.description);
    setStartTime(auction.start_time);
    setEndTime(auction.end_time);
    setEditingId(auction.id);
  };

  const handleDelete = async (id) => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      await axios.delete(`${API_URL}${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAuctions(auctions.filter(a => a.id !== id));
    } catch (err) {
      Alert.alert('Error', 'Failed to delete auction');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Auction Management</Text>
        <Text style={styles.description}>
          Admins can create, edit, or delete auctions from this page.
        </Text>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Auction Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Start Time (YYYY-MM-DDTHH:MM)"
        value={startTime}
        onChangeText={setStartTime}
      />
      <TextInput
        style={styles.input}
        placeholder="End Time (YYYY-MM-DDTHH:MM)"
        value={endTime}
        onChangeText={setEndTime}
      />
      <Button
        title={editingId ? "Update Auction" : "Add Auction"}
        onPress={handleCreateOrUpdate}
      />
      <FlatList
        data={auctions}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.auctionItem}>
            <Text>{item.name}</Text>
            <Button title="Edit" onPress={() => handleEdit(item)} />
            <Button title="Delete" onPress={() => handleDelete(item.id)} />
          </View>
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
  input: { borderWidth: 1, marginBottom: 12, padding: 8, borderRadius: 4 },
  auctionItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }
});
