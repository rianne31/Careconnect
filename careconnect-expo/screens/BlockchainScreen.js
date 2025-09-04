import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Dimensions } from 'react-native';
import Card from '../components/ui/Card';
import PrimaryButton from '../components/ui/PrimaryButton';
import WalletConnector from '../components/WalletConnector';
import TxStatus from '../components/TxStatus';

const { width } = Dimensions.get('window');

export default function BlockchainScreen() {
  const [connectedWallet, setConnectedWallet] = useState(null);
  const [walletBalance, setWalletBalance] = useState('0.0');
  const [transactionHash, setTransactionHash] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState('ethereum');
  const [donationAmount, setDonationAmount] = useState('');
  const [selectedToken, setSelectedToken] = useState('ETH');

  const networks = [
    { id: 'ethereum', name: 'Ethereum', icon: '⟠', color: '#627eea' },
    { id: 'polygon', name: 'Polygon', icon: '⬟', color: '#8247e5' },
    { id: 'bsc', name: 'BSC', icon: '🔶', color: '#f3ba2f' },
    { id: 'arbitrum', name: 'Arbitrum', icon: '🔷', color: '#28a0f0' }
  ];

  const tokens = [
    { symbol: 'ETH', name: 'Ethereum', balance: '2.5', icon: '⟠' },
    { symbol: 'USDC', name: 'USD Coin', balance: '150.0', icon: '💵' },
    { symbol: 'USDT', name: 'Tether', balance: '75.0', icon: '💸' },
    { symbol: 'MATIC', name: 'Polygon', balance: '500.0', icon: '⬟' }
  ];

  const recentTransactions = [
    {
      id: 1,
      hash: '0x1234...5678',
      type: 'donation',
      amount: '0.1 ETH',
      to: 'CareConnect Fund',
      status: 'confirmed',
      timestamp: '2 hours ago',
      gasUsed: '21,000',
      gasPrice: '20 Gwei'
    },
    {
      id: 2,
      hash: '0xabcd...efgh',
      type: 'auction_bid',
      amount: '50 USDC',
      to: 'Auction Contract',
      status: 'pending',
      timestamp: '1 day ago',
      gasUsed: '45,000',
      gasPrice: '15 Gwei'
    },
    {
      id: 3,
      hash: '0x9876...5432',
      type: 'donation',
      amount: '0.05 ETH',
      to: 'Sarah\'s Treatment',
      status: 'confirmed',
      timestamp: '3 days ago',
      gasUsed: '21,000',
      gasPrice: '18 Gwei'
    }
  ];

  const handleConnectWallet = (walletType) => {
    // Simulate wallet connection
    setConnectedWallet(walletType);
    setWalletBalance('2.5');
    Alert.alert('Wallet Connected', `${walletType} wallet connected successfully!`);
  };

  const handleDisconnectWallet = () => {
    setConnectedWallet(null);
    setWalletBalance('0.0');
    Alert.alert('Wallet Disconnected', 'Wallet has been disconnected.');
  };

  const handleSendDonation = () => {
    if (!donationAmount) {
      Alert.alert('Error', 'Please enter donation amount');
      return;
    }
    if (!connectedWallet) {
      Alert.alert('Error', 'Please connect a wallet first');
      return;
    }

    Alert.alert(
      'Confirm Transaction',
      `Send ${donationAmount} ${selectedToken} to CareConnect Fund?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Confirm', 
          onPress: () => {
            // Simulate transaction
            const mockHash = '0x' + Math.random().toString(16).substr(2, 8) + '...' + Math.random().toString(16).substr(2, 8);
            setTransactionHash(mockHash);
            Alert.alert('Transaction Sent', `Transaction hash: ${mockHash}`);
          }
        }
      ]
    );
  };

  const handleCheckTransaction = () => {
    if (!transactionHash) {
      Alert.alert('Error', 'Please enter transaction hash');
      return;
    }
    Alert.alert('Transaction Details', `Checking transaction: ${transactionHash}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'failed': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'donation': return '💝';
      case 'auction_bid': return '🔨';
      case 'withdrawal': return '💸';
      default: return '📄';
    }
  };

  const renderWalletSection = () => (
    <Card style={styles.section}>
      <Text style={styles.sectionTitle}>Wallet Connection</Text>
      
      {!connectedWallet ? (
        <View style={styles.walletOptions}>
          <TouchableOpacity
            style={styles.walletOption}
            onPress={() => handleConnectWallet('MetaMask')}
          >
            <Text style={styles.walletIcon}>🦊</Text>
            <Text style={styles.walletName}>MetaMask</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.walletOption}
            onPress={() => handleConnectWallet('WalletConnect')}
          >
            <Text style={styles.walletIcon}>🔗</Text>
            <Text style={styles.walletName}>WalletConnect</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.walletOption}
            onPress={() => handleConnectWallet('Coinbase')}
          >
            <Text style={styles.walletIcon}>🔵</Text>
            <Text style={styles.walletName}>Coinbase</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.connectedWallet}>
          <View style={styles.walletInfo}>
            <Text style={styles.walletType}>{connectedWallet}</Text>
            <Text style={styles.walletAddress}>0x1234...5678</Text>
            <Text style={styles.walletBalance}>Balance: {walletBalance} ETH</Text>
          </View>
          <TouchableOpacity
            style={styles.disconnectButton}
            onPress={handleDisconnectWallet}
          >
            <Text style={styles.disconnectText}>Disconnect</Text>
          </TouchableOpacity>
        </View>
      )}
    </Card>
  );

  const renderNetworkSelection = () => (
    <Card style={styles.section}>
      <Text style={styles.sectionTitle}>Network</Text>
      <View style={styles.networkGrid}>
        {networks.map((network) => (
          <TouchableOpacity
            key={network.id}
            style={[
              styles.networkCard,
              selectedNetwork === network.id && styles.selectedNetworkCard
            ]}
            onPress={() => setSelectedNetwork(network.id)}
          >
            <Text style={styles.networkIcon}>{network.icon}</Text>
            <Text style={[
              styles.networkName,
              selectedNetwork === network.id && styles.selectedNetworkText
            ]}>
              {network.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </Card>
  );

  const renderTokenSelection = () => (
    <Card style={styles.section}>
      <Text style={styles.sectionTitle}>Select Token</Text>
      <View style={styles.tokenList}>
        {tokens.map((token) => (
          <TouchableOpacity
            key={token.symbol}
            style={[
              styles.tokenItem,
              selectedToken === token.symbol && styles.selectedTokenItem
            ]}
            onPress={() => setSelectedToken(token.symbol)}
          >
            <View style={styles.tokenInfo}>
              <Text style={styles.tokenIcon}>{token.icon}</Text>
              <View style={styles.tokenDetails}>
                <Text style={styles.tokenSymbol}>{token.symbol}</Text>
                <Text style={styles.tokenName}>{token.name}</Text>
              </View>
            </View>
            <Text style={styles.tokenBalance}>{token.balance}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </Card>
  );

  const renderDonationSection = () => (
    <Card style={styles.section}>
      <Text style={styles.sectionTitle}>Send Donation</Text>
      
      <View style={styles.donationForm}>
        <View style={styles.amountInputContainer}>
          <Text style={styles.inputLabel}>Amount</Text>
          <View style={styles.amountInputRow}>
            <TextInput
              style={styles.amountInput}
              placeholder="0.0"
              value={donationAmount}
              onChangeText={setDonationAmount}
              keyboardType="numeric"
              placeholderTextColor="#9ca3af"
            />
            <Text style={styles.tokenSymbol}>{selectedToken}</Text>
          </View>
        </View>

        <View style={styles.recipientInfo}>
          <Text style={styles.recipientLabel}>Recipient:</Text>
          <Text style={styles.recipientAddress}>CareConnect Fund</Text>
          <Text style={styles.recipientAddress}>0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6</Text>
        </View>

        <View style={styles.gasEstimate}>
          <Text style={styles.gasLabel}>Estimated Gas:</Text>
          <Text style={styles.gasAmount}>21,000 units (~$5.20)</Text>
        </View>

        <PrimaryButton
          title="Send Donation"
          onPress={handleSendDonation}
          style={styles.sendButton}
          disabled={!connectedWallet || !donationAmount}
        />
      </View>
    </Card>
  );

  const renderTransactionHistory = () => (
    <Card style={styles.section}>
      <Text style={styles.sectionTitle}>Recent Transactions</Text>
      
      {recentTransactions.map((tx) => (
        <TouchableOpacity
          key={tx.id}
          style={styles.transactionItem}
          onPress={() => console.log('View transaction details:', tx.hash)}
        >
          <View style={styles.transactionHeader}>
            <View style={styles.transactionIcon}>
              <Text style={styles.txIconText}>{getTransactionIcon(tx.type)}</Text>
            </View>
            <View style={styles.transactionInfo}>
              <Text style={styles.transactionType}>
                {tx.type === 'donation' ? 'Donation' : 'Auction Bid'}
              </Text>
              <Text style={styles.transactionTo}>to {tx.to}</Text>
            </View>
            <View style={styles.transactionAmount}>
              <Text style={styles.amountText}>{tx.amount}</Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(tx.status) }]}>
                <Text style={styles.statusText}>{tx.status}</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.transactionDetails}>
            <Text style={styles.txHash}>Hash: {tx.hash}</Text>
            <Text style={styles.txTime}>{tx.timestamp}</Text>
            <Text style={styles.txGas}>Gas: {tx.gasUsed} @ {tx.gasPrice}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </Card>
  );

  const renderTransactionChecker = () => (
    <Card style={styles.section}>
      <Text style={styles.sectionTitle}>Transaction Status Checker</Text>
      
      <View style={styles.checkerForm}>
        <Text style={styles.inputLabel}>Transaction Hash</Text>
        <TextInput
          style={styles.hashInput}
          placeholder="0x..."
          value={transactionHash}
          onChangeText={setTransactionHash}
          placeholderTextColor="#9ca3af"
        />
        
        <PrimaryButton
          title="Check Transaction"
          onPress={handleCheckTransaction}
          style={styles.checkButton}
        />
        
        <TouchableOpacity
          style={styles.backToHomeButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.backToHomeText}>← Back to Home</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Blockchain</Text>
        <Text style={styles.subtitle}>
          Connect your wallet, send donations, and track transactions on the blockchain
        </Text>
      </View>

      {renderWalletSection()}
      {renderNetworkSelection()}
      {renderTokenSelection()}
      {renderDonationSection()}
      {renderTransactionHistory()}
      {renderTransactionChecker()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f7fb',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2d3436',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#636e72',
    textAlign: 'center',
    lineHeight: 22,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d3436',
    marginBottom: 16,
  },
  walletOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  walletOption: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e1e5e9',
    minWidth: 80,
  },
  walletIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  walletName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2d3436',
    textAlign: 'center',
  },
  connectedWallet: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  walletInfo: {
    flex: 1,
  },
  walletType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d3436',
    marginBottom: 4,
  },
  walletAddress: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },
  walletBalance: {
    fontSize: 14,
    color: '#10b981',
    fontWeight: '600',
  },
  disconnectButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#ef4444',
  },
  disconnectText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  networkGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  networkCard: {
    width: (width - 56) / 2,
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e1e5e9',
    backgroundColor: 'white',
  },
  selectedNetworkCard: {
    borderColor: '#3b82f6',
    backgroundColor: '#eff6ff',
  },
  networkIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  networkName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  selectedNetworkText: {
    color: '#3b82f6',
  },
  tokenList: {
    gap: 8,
  },
  tokenItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e1e5e9',
    backgroundColor: 'white',
  },
  selectedTokenItem: {
    borderColor: '#3b82f6',
    backgroundColor: '#eff6ff',
  },
  tokenInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tokenIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  tokenDetails: {
    flex: 1,
  },
  tokenSymbol: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d3436',
  },
  tokenName: {
    fontSize: 14,
    color: '#6b7280',
  },
  tokenBalance: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10b981',
  },
  donationForm: {
    gap: 16,
  },
  amountInputContainer: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  amountInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    backgroundColor: 'white',
    paddingHorizontal: 12,
  },
  amountInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#2d3436',
    paddingVertical: 12,
  },
  recipientInfo: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e1e5e9',
  },
  recipientLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2d3436',
    marginBottom: 4,
  },
  recipientAddress: {
    fontSize: 12,
    color: '#6b7280',
    fontFamily: 'monospace',
  },
  gasEstimate: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#e1e5e9',
  },
  gasLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  gasAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#f59e0b',
  },
  sendButton: {
    marginTop: 8,
  },
  transactionItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
  },
  transactionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  txIconText: {
    fontSize: 20,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d3436',
    marginBottom: 2,
  },
  transactionTo: {
    fontSize: 14,
    color: '#6b7280',
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d3436',
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  transactionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  txHash: {
    fontSize: 12,
    color: '#6b7280',
    fontFamily: 'monospace',
    flex: 1,
  },
  txTime: {
    fontSize: 12,
    color: '#6b7280',
  },
  txGas: {
    fontSize: 12,
    color: '#6b7280',
  },
  checkerForm: {
    gap: 12,
  },
  hashInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: 'white',
    fontFamily: 'monospace',
  },
  checkButton: {
    marginTop: 8,
  },
  backToHomeButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    alignItems: 'center',
  },
  backToHomeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3b82f6',
  },
});