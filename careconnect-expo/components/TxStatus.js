import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';
import * as ethers from 'ethers';

export default function TxStatus({ rpcUrl = 'https://eth.llamarpc.com' }) {
  const [hash, setHash] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [blockNumber, setBlockNumber] = useState('');

  const check = async () => {
    setError('');
    setStatus('');
    setBlockNumber('');
    try {
      if (!hash || !/^0x([A-Fa-f0-9]{64})$/.test(hash)) {
        setError('Enter a valid transaction hash.');
        return;
      }
      const provider = new ethers.JsonRpcProvider(rpcUrl);
      const receipt = await provider.getTransactionReceipt(hash);
      if (!receipt) {
        setStatus('Pending or not found');
        return;
      }
      setStatus(receipt.status === 1 ? 'Success' : 'Failed');
      setBlockNumber(receipt.blockNumber?.toString?.() || '');
    } catch (e) {
      setError(e?.message || 'Lookup failed');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transaction Status</Text>
      <TextInput
        style={styles.input}
        value={hash}
        onChangeText={setHash}
        placeholder="Paste transaction hash (0x...)"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <Button title="Check Status" onPress={check} />
      {!!status && <Text style={styles.row}>Status: {status}</Text>}
      {!!blockNumber && <Text style={styles.row}>Block: {blockNumber}</Text>}
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    marginBottom: 16,
  },
  title: { fontSize: 18, fontWeight: 'bold', color: '#2d3436', marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#dfe6e9',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    color: '#2d3436',
  },
  row: { color: '#2d3436', marginTop: 8 },
  error: { color: '#d63031', marginTop: 8 },
});


