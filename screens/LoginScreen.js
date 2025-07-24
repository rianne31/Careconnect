import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://YOUR_BACKEND_URL/api/token/', {
        username,
        password,
      });
      await AsyncStorage.setItem('access_token', response.data.access);
      await AsyncStorage.setItem('refresh_token', response.data.refresh);
      // Decode JWT to get user role
      const decoded = jwt_decode(response.data.access);
      const userRole = decoded.role; // Adjust this if your JWT payload uses a different key
      if (userRole === 'admin') {
        navigation.navigate('PatientManagement');
      } else if (userRole === 'donor') {
        navigation.navigate('Home');
      } else {
        navigation.navigate('Home');
      }
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Login</Text>
        <Text style={styles.description}>
          Please log in to access your CareConnect account. Enter your credentials below.
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
      <Button title="Login" onPress={handleLogin} />
      <Button title="Register" onPress={() => navigation.navigate('Register')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 24, marginBottom: 16 },
  input: { borderWidth: 1, marginBottom: 12, padding: 8, borderRadius: 4 },
  error: { color: 'red', marginBottom: 8 },
  header: { marginBottom: 16 },
  description: { fontSize: 14, color: '#636e72', marginBottom: 16, textAlign: 'center' },
}); 