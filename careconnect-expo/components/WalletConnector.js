import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import * as ethers from 'ethers';

export default function WalletConnector() {
  const [address, setAddress] = useState('');
  const [chainId, setChainId] = useState('');
  const [error, setError] = useState('');

  const isWeb = typeof window !== 'undefined';
  const hasEthereum = isWeb && typeof window.ethereum !== 'undefined';

  const connect = async () => {
    setError('');
    try {
      if (!hasEthereum) {
        setError('No injected wallet detected. Use MetaMask on web.');
        return;
      }
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      const network = await provider.getNetwork();
      setAddress(accounts[0] || '');
      setChainId(network.chainId ? network.chainId.toString() : '');
    } catch (e) {
      setError(e?.message || 'Failed to connect');
    }
  };

  useEffect(() => {
    if (!hasEthereum) return;
    const handler = (accs) => setAddress(Array.isArray(accs) && accs.length ? accs[0] : '');
    const chainHandler = (cid) => setChainId(cid);
    window.ethereum?.on?.('accountsChanged', handler);
    window.ethereum?.on?.('chainChanged', chainHandler);
    return () => {
      window.ethereum?.removeListener?.('accountsChanged', handler);
      window.ethereum?.removeListener?.('chainChanged', chainHandler);
    };
  }, [hasEthereum]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wallet</Text>
      {address ? (
        <View>
          <Text style={styles.row}>Address: {address}</Text>
          <Text style={styles.row}>Chain ID: {chainId}</Text>
        </View>
      ) : (
        <Text style={styles.hint}>Connect a wallet (web/MetaMask)</Text>
      )}
      <View style={styles.actions}>
        <Button title={address ? 'Connected' : 'Connect Wallet'} onPress={connect} disabled={!!address} />
      </View>
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
  row: { color: '#2d3436', marginBottom: 4 },
  hint: { color: '#636e72', marginBottom: 8 },
  actions: { marginTop: 8 },
  error: { color: '#d63031', marginTop: 8 },
});


