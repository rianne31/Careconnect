import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://YOUR_BACKEND_URL/api/donations/';

export default function DonationScreen() {
  const [type, setType] = useState('money'); // or 'item'
  const [amount, setAmount] = useState('');
  const [item, setItem] = useState('');

  const handleDonate = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      const data = type === 'money'
        ? { type, amount }
        : { type, item };
      await axios.post(API_URL, data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAmount('');
      setItem('');
      Alert.alert('Success', 'Donation submitted!');
    } catch (err) {
      Alert.alert('Error', 'Failed to submit donation');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Make a Donation</Text>
        <Text style={styles.description}>
          Support our mission by making a monetary or item donation. Every contribution counts!
        </Text>
      </View>
      <Button title="Monetary" onPress={() => setType('money')} />
      <Button title="Item" onPress={() => setType('item')} />
      {type === 'money' ? (
        <TextInput
          style={styles.input}
          placeholder="Amount"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />
      ) : (
        <TextInput
          style={styles.input}
          placeholder="Item Description"
          value={item}
          onChangeText={setItem}
        />
      )}
      <Button title="Donate" onPress={handleDonate} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  title: { fontSize: 24, marginBottom: 16 },
  input: { borderWidth: 1, marginBottom: 12, padding: 8, borderRadius: 4 },
  header: { marginBottom: 16 },
  description: { fontSize: 14, color: '#636e72', marginBottom: 16, textAlign: 'center' },
}); 