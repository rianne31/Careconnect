import React, { useEffect, useState, useRef } from 'react';
import { View, Text, FlatList, Button, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { patientService } from '../services/apiService';

// Optional WebSocket (if you have it)
const WS_URL = null;

export default function PatientManagementScreen() {
  const [patients, setPatients] = useState([]);
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const ws = useRef(null);

  // Fetch initial patients list
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const data = await patientService.getPatients();
        setPatients(Array.isArray(data) ? data : (data?.results ?? []));
      } catch (err) {
        Alert.alert('Error', 'Failed to fetch patients');
      }
    };
    fetchPatients();
  }, []);

  // WebSocket for real-time updates
  useEffect(() => {
    if (!WS_URL) return; // skip if not configured
    ws.current = new WebSocket(WS_URL);
    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setPatients(data);
      } catch (e) {}
    };
    ws.current.onerror = () => Alert.alert('Error', 'WebSocket error');
    return () => { if (ws.current) ws.current.close(); };
  }, []);

  const handleCreateOrUpdate = async () => {
    try {
      if (editingId) {
        await patientService.updatePatient(editingId, { name });
      } else {
        await patientService.createPatient({ name });
      }
      setName('');
      setEditingId(null);
      // Refresh list (fallback if no websockets)
      const data = await patientService.getPatients();
      setPatients(Array.isArray(data) ? data : (data?.results ?? []));
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
      await patientService.deletePatient(id);
      const data = await patientService.getPatients();
      setPatients(Array.isArray(data) ? data : (data?.results ?? []));
    } catch (err) {
      Alert.alert('Error', 'Failed to delete patient');
    }
  };

  // Approvals
  const pending = patients.filter(p => (p.status || p.approval_status || 'approved') === 'pending');
  const approved = patients.filter(p => (p.status || p.approval_status || 'approved') === 'approved');

  const handleApprove = async (id) => {
    try {
      await patientService.updatePatient(id, { status: 'approved' });
      const data = await patientService.getPatients();
      setPatients(Array.isArray(data) ? data : (data?.results ?? []));
    } catch (e) {
      Alert.alert('Error', 'Failed to approve');
    }
  };

  const handleReject = async (id) => {
    try {
      // Either delete or set rejected depending on backend
      try {
        await patientService.updatePatient(id, { status: 'rejected' });
      } catch (_) {
        await patientService.deletePatient(id);
      }
      const data = await patientService.getPatients();
      setPatients(Array.isArray(data) ? data : (data?.results ?? []));
    } catch (e) {
      Alert.alert('Error', 'Failed to reject');
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
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Approvals Queue</Text>
        {pending.length === 0 ? (
          <Text style={styles.empty}>No pending approvals</Text>
        ) : (
          <FlatList
            data={pending}
            keyExtractor={item => String(item.id)}
            renderItem={({ item }) => (
              <View style={styles.approvalItem}>
                <Text style={styles.approvalName}>{item.name || item.code}</Text>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <TouchableOpacity style={[styles.chip, styles.approve]} onPress={() => handleApprove(item.id)}>
                    <Text style={styles.chipText}>Approve</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.chip, styles.reject]} onPress={() => handleReject(item.id)}>
                    <Text style={styles.chipText}>Reject</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        )}
      </View>

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
  patientItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  section: { marginVertical: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
  empty: { color: '#6b7280' },
  approvalItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#eef2ff' },
  approvalName: { fontWeight: '600', color: '#111827' },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999 },
  chipText: { color: 'white', fontWeight: '700' },
  approve: { backgroundColor: '#10b981' },
  reject: { backgroundColor: '#ef4444' }
}); 