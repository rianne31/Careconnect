import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import Card from '../components/ui/Card';
import { useSelector } from 'react-redux';
import { donationService } from '../services/apiService';

const { width } = Dimensions.get('window');

export default function DonationHistoryScreen({ navigation }) {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState('all');
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const user = useSelector((state) => state.user.user);

  // Example donation history data
  const donationHistory = [
    {
      id: 1,
      type: 'money',
      amount: 50,
      recipient: 'Sarah Johnson',
      recipientType: 'patient',
      category: 'Medical Treatment',
      date: new Date('2024-01-15'),
      status: 'completed',
      message: 'Hope this helps with your treatment!',
      impact: 'Helped cover 1 day of treatment',
      receipt: 'DON-2024-001',
      paymentMethod: 'Credit Card'
    },
    {
      id: 2,
      type: 'item',
      item: 'Art Supplies Kit',
      recipient: 'General Fund',
      recipientType: 'fund',
      category: 'Art Therapy',
      date: new Date('2024-01-10'),
      status: 'delivered',
      message: 'These supplies will help kids express themselves through art',
      impact: 'Supports 5 art therapy sessions',
      receipt: 'ITEM-2024-002',
      estimatedValue: 25
    },
    {
      id: 3,
      type: 'money',
      amount: 100,
      recipient: 'Research Fund',
      recipientType: 'fund',
      category: 'Cancer Research',
      date: new Date('2024-01-05'),
      status: 'completed',
      message: 'Supporting the fight against pediatric cancer',
      impact: 'Funds 2 hours of research',
      receipt: 'DON-2024-003',
      paymentMethod: 'PayPal'
    },
    {
      id: 4,
      type: 'money',
      amount: 25,
      recipient: 'Michael Chen',
      recipientType: 'patient',
      category: 'Family Support',
      date: new Date('2023-12-28'),
      status: 'completed',
      message: 'Sending love and support to your family',
      impact: 'Helped with transportation costs',
      receipt: 'DON-2023-156',
      paymentMethod: 'Bank Transfer'
    },
    {
      id: 5,
      type: 'item',
      item: 'Children\'s Books Collection',
      recipient: 'Hospital Library',
      recipientType: 'facility',
      category: 'Education',
      date: new Date('2023-12-20'),
      status: 'delivered',
      message: 'Books to bring joy to young patients',
      impact: 'Enriches 20+ children\'s hospital stays',
      receipt: 'ITEM-2023-089',
      estimatedValue: 40
    },
    {
      id: 6,
      type: 'money',
      amount: 200,
      recipient: 'Emma Wilson',
      recipientType: 'patient',
      category: 'Medical Treatment',
      date: new Date('2023-12-15'),
      status: 'completed',
      message: 'You\'re so brave! Keep fighting!',
      impact: 'Covered 3 days of specialized treatment',
      receipt: 'DON-2023-142',
      paymentMethod: 'Credit Card'
    }
  ];

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'money', label: 'Monetary' },
    { key: 'item', label: 'Items' }
  ];

  const timeframes = [
    { key: 'all', label: 'All Time' },
    { key: 'month', label: 'This Month' },
    { key: 'quarter', label: 'This Quarter' },
    { key: 'year', label: 'This Year' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#10b981';
      case 'delivered': return '#3b82f6';
      case 'pending': return '#f59e0b';
      case 'failed': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getRecipientIcon = (type) => {
    switch (type) {
      case 'patient': return '👤';
      case 'fund': return '💰';
      case 'facility': return '🏥';
      default: return '💝';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Medical Treatment': return '🏥';
      case 'Art Therapy': return '🎨';
      case 'Cancer Research': return '🔬';
      case 'Family Support': return '👨‍👩‍👧‍👦';
      case 'Education': return '📚';
      default: return '💝';
    }
  };

  const sourceDonations = donations.length > 0 ? donations : donationHistory;
  const filteredDonations = sourceDonations.filter(donation => {
    const typeMatch = selectedFilter === 'all' || donation.type === selectedFilter;
    
    const now = new Date();
    let timeMatch = true;
    if (selectedTimeframe !== 'all') {
      const donationDate = new Date(donation.date);
      switch (selectedTimeframe) {
        case 'month':
          timeMatch = donationDate >= new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case 'quarter':
          const quarterStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
          timeMatch = donationDate >= quarterStart;
          break;
        case 'year':
          timeMatch = donationDate >= new Date(now.getFullYear(), 0, 1);
          break;
      }
    }
    
    return typeMatch && timeMatch;
  });

  const totalDonated = filteredDonations
    .filter(d => d.type === 'money')
    .reduce((sum, d) => sum + d.amount, 0);

  const totalItems = filteredDonations.filter(d => d.type === 'item').length;

  const renderDonationItem = ({ item }) => (
    <TouchableOpacity
      style={styles.donationCard}
      onPress={() => console.log('View donation details:', item.id)}
      activeOpacity={0.7}
    >
      <Card style={styles.card}>
        <View style={styles.donationHeader}>
          <View style={styles.donationIcon}>
            <Text style={styles.iconText}>
              {item.type === 'money' ? '💰' : '📦'}
            </Text>
          </View>
          <View style={styles.donationInfo}>
            <Text style={styles.donationTitle}>
              {item.type === 'money' 
                ? `$${item.amount} to ${item.recipient}`
                : `${item.item} to ${item.recipient}`
              }
            </Text>
            <Text style={styles.donationDate}>
              {item.date.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              })}
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
          </View>
        </View>

        <View style={styles.donationDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailIcon}>{getCategoryIcon(item.category)}</Text>
            <Text style={styles.detailText}>{item.category}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailIcon}>{getRecipientIcon(item.recipientType)}</Text>
            <Text style={styles.detailText}>{item.recipient}</Text>
          </View>

          {item.message && (
            <View style={styles.messageContainer}>
              <Text style={styles.messageText}>"{item.message}"</Text>
            </View>
          )}

          <View style={styles.impactContainer}>
            <Text style={styles.impactLabel}>Impact:</Text>
            <Text style={styles.impactText}>{item.impact}</Text>
          </View>

          <View style={styles.receiptContainer}>
            <Text style={styles.receiptLabel}>Receipt:</Text>
            <TouchableOpacity onPress={() => {
              // You could navigate to a receipt detail screen here
              console.log('View receipt:', item.receipt);
            }}>
              <Text style={styles.receiptText}>{item.receipt}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

  const renderStats = () => (
    <View style={styles.statsContainer}>
      <View style={styles.statCard}>
        <Text style={styles.statNumber}>{filteredDonations.length}</Text>
        <Text style={styles.statLabel}>Total Donations</Text>
      </View>
      <View style={styles.statCard}>
        <Text style={styles.statNumber}>${totalDonated}</Text>
        <Text style={styles.statLabel}>Money Donated</Text>
      </View>
      <View style={styles.statCard}>
        <Text style={styles.statNumber}>{totalItems}</Text>
        <Text style={styles.statLabel}>Items Donated</Text>
      </View>
    </View>
  );

  // Normalize backend donation → UI shape
  const normalizeDonation = (d) => ({
    id: d.id,
    type: d.type === 'item' ? 'item' : 'money',
    amount: d.amount ?? undefined,
    item: d.item ?? undefined,
    recipient: d.recipient_name ?? (d.type === 'item' ? 'General Fund' : 'Patient'),
    recipientType: d.recipient_type ?? 'patient',
    category: d.category ?? 'Medical Treatment',
    date: d.date ? new Date(d.date) : new Date(),
    status: 'completed',
    message: d.note ?? '',
    impact: d.impact ?? '',
    receipt: d.blockchain_txn_id ?? `DON-${d.id}`,
    paymentMethod: 'Card',
  });

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await donationService.getDonations();
        if (!alive) return;
        const normalized = Array.isArray(data)
          ? data.map(normalizeDonation)
          : (Array.isArray(data?.results) ? data.results.map(normalizeDonation) : []);
        setDonations(normalized);
      } catch (e) {
        setError('Showing demo data (backend not reachable).');
      } finally {
        setLoading(false);
      }
    };
    load();
    return () => { alive = false; };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Donation History</Text>
        <Text style={styles.description}>
          Track your impact and view all your contributions to pediatric cancer care
        </Text>
        {!!loading && <Text style={styles.loadingText}>Loading donations…</Text>}
        {!!error && <Text style={styles.errorText}>{error}</Text>}
      </View>

      {renderStats()}

      {/* Filter Tabs */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.key}
            style={[
              styles.filterTab,
              selectedFilter === filter.key && styles.activeFilterTab
            ]}
            onPress={() => setSelectedFilter(filter.key)}
          >
            <Text style={[
              styles.filterText,
              selectedFilter === filter.key && styles.activeFilterText
            ]}>
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Timeframe Filter */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.timeframeContainer}
        contentContainerStyle={styles.timeframeContent}
      >
        {timeframes.map((timeframe) => (
          <TouchableOpacity
            key={timeframe.key}
            style={[
              styles.timeframeTab,
              selectedTimeframe === timeframe.key && styles.activeTimeframeTab
            ]}
            onPress={() => setSelectedTimeframe(timeframe.key)}
          >
            <Text style={[
              styles.timeframeText,
              selectedTimeframe === timeframe.key && styles.activeTimeframeText
            ]}>
              {timeframe.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filteredDonations}
        keyExtractor={item => item.id.toString()}
        renderItem={renderDonationItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
      
      <TouchableOpacity
        style={styles.backToHomeButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.backToHomeText}>← Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f7fb',
    paddingTop: 16,
  },
  header: {
    paddingHorizontal: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2d3436',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#636e72',
    textAlign: 'center',
    lineHeight: 22,
  },
  loadingText: { marginTop: 8, color: '#6b7280' },
  errorText: { marginTop: 6, color: '#ef4444' },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  statCard: {
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    minWidth: 80,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d3436',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
    textAlign: 'center',
  },
  filterContainer: {
    marginBottom: 12,
  },
  filterContent: {
    paddingHorizontal: 16,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e1e5e9',
  },
  activeFilterTab: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  activeFilterText: {
    color: 'white',
  },
  timeframeContainer: {
    marginBottom: 16,
  },
  timeframeContent: {
    paddingHorizontal: 16,
  },
  timeframeTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 6,
    borderRadius: 16,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e1e5e9',
  },
  activeTimeframeTab: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  timeframeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
  },
  activeTimeframeText: {
    color: 'white',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  donationCard: {
    marginBottom: 16,
  },
  card: {
    padding: 0,
    overflow: 'hidden',
  },
  donationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
  },
  donationIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 24,
  },
  donationInfo: {
    flex: 1,
  },
  donationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d3436',
    marginBottom: 4,
  },
  donationDate: {
    fontSize: 14,
    color: '#6b7280',
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
  donationDetails: {
    padding: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailIcon: {
    fontSize: 16,
    marginRight: 8,
    width: 20,
  },
  detailText: {
    fontSize: 14,
    color: '#6b7280',
  },
  messageContainer: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
  },
  messageText: {
    fontSize: 14,
    color: '#2d3436',
    fontStyle: 'italic',
  },
  impactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f3f4',
  },
  impactLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2d3436',
    marginRight: 8,
  },
  impactText: {
    fontSize: 14,
    color: '#10b981',
    fontWeight: '600',
  },
  receiptContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  receiptLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginRight: 8,
  },
  receiptText: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '600',
  },
  backToHomeButton: {
    marginTop: 20,
    marginHorizontal: 16,
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