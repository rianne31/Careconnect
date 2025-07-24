import React, { useEffect, useState, useRef } from 'react';
import { View, Text, FlatList, Button, TextInput, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://YOUR_BACKEND_URL/api/patientprofiles/';
const WS_URL = 'ws://YOUR_BACKEND_URL/ws/patients/'; // Update with your backend WebSocket URL

export default function PatientManagementScreen() {
  const [patients, setPatients] = useState([]);
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const ws = useRef(null);

  // Fetch JWT token from storage
  const getToken = async () => {
    return await AsyncStorage.getItem('access_token');
  };

  // Fetch initial patients list
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const token = await getToken();
        const res = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPatients(res.data);
      } catch (err) {
        Alert.alert('Error', 'Failed to fetch patients');
      }
    };
    fetchPatients();
  }, []);

  // WebSocket for real-time updates
  useEffect(() => {
    ws.current = new WebSocket(WS_URL);
    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setPatients(data); // Adjust if your backend sends a different format
      } catch (e) {
        // Ignore invalid messages
      }
    };
    ws.current.onerror = () => Alert.alert('Error', 'WebSocket error');
    return () => {
      if (ws.current) ws.current.close();
    };
  }, []);

  const handleCreateOrUpdate = async () => {
    try {
      const token = await getToken();
      if (editingId) {
        await axios.put(`${API_URL}${editingId}/`, { name }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(API_URL, { name }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setName('');
      setEditingId(null);
      // No need to refresh, WebSocket will update
    } catch (err) {
      Alert.alert('Error', 'Failed to save patient');
    }
  };

  const handleEdit = (patient) => {
    setName(patient.name);
    setEditingId(patient.id);
  };

  const handleDelete = async (id) => {
    try {
      const token = await getToken();
      await axios.delete(`${API_URL}${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // No need to refresh, WebSocket will update
    } catch (err) {
      Alert.alert('Error', 'Failed to delete patient');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Patient Management</Text>
        <Text style={styles.description}>
          Admins can add, edit, or remove patient profiles and see real-time updates here.
        </Text>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Patient Name"
        value={name}
        onChangeText={setName}
      />
      <Button
        title={editingId ? "Update Patient" : "Add Patient"}
        onPress={handleCreateOrUpdate}
      />
      <FlatList
        data={patients}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.patientItem}>
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
  patientItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }
}); 