import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import axios from 'axios';

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('donor'); // or 'admin'
  const [error, setError] = useState('');

  const handleRegister = async () => {
    try {
      await axios.post('http://YOUR_BACKEND_URL/api/register/', {
        username,
        password,
        role,
      });
      navigation.navigate('Login');
    } catch (err) {
      setError('Registration failed');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Register</Text>
        <Text style={styles.description}>
          Create a new CareConnect account. Fill in your details to get started.
        </Text>
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Role (admin/donor)"
        value={role}
        onChangeText={setRole}
      />
      <Button title="Register" onPress={handleRegister} />
      <Button title="Back to Login" onPress={() => navigation.navigate('Login')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  header: { marginBottom: 16 },
  description: { fontSize: 14, color: '#636e72', marginBottom: 16, textAlign: 'center' },
  title: { fontSize: 24, marginBottom: 16 },
  input: { borderWidth: 1, marginBottom: 12, padding: 8, borderRadius: 4 },
  error: { color: 'red', marginBottom: 8 },
}); 