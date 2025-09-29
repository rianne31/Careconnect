import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ScrollView, Image, Dimensions } from 'react-native';
import Card from '../components/ui/Card';
import PrimaryButton from '../components/ui/PrimaryButton';
import { auctionService } from '../services/apiService';

const { width } = Dimensions.get('window');

export default function AuctionListScreen({ navigation }) {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Local fallback demo data (used if backend unavailable)
  const exampleAuctions = [
    {
      id: 1,
      name: 'Handmade Art Supplies Kit',
      description: 'Complete set of art supplies donated by local artist',
      currentBid: 45,
      startingBid: 20,
      image: '🎨',
      status: 'active',
      endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      bidCount: 12,
      donor: 'Sarah Johnson',
      category: 'Art & Crafts'
    },
    {
      id: 2,
      name: 'Vintage Book Collection',
      description: 'Rare children\'s books from the 1950s',
      currentBid: 85,
      startingBid: 30,
      image: '📚',
      status: 'active',
      endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      bidCount: 8,
      donor: 'Mike Chen',
      category: 'Books'
    },
    {
      id: 3,
      name: 'Gourmet Cooking Class',
      description: 'Private cooking lesson with professional chef',
      currentBid: 120,
      startingBid: 50,
      image: '👨‍🍳',
      status: 'active',
      endTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
      bidCount: 15,
      donor: 'Chef Maria',
      category: 'Experiences'
    },
    {
      id: 4,
      name: 'Sports Equipment Bundle',
      description: 'Basketball, soccer ball, and tennis racket',
      currentBid: 35,
      startingBid: 15,
      image: '⚽',
      status: 'upcoming',
      endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      bidCount: 0,
      donor: 'Coach David',
      category: 'Sports'
    },
    {
      id: 5,
      name: 'Tech Gadgets Package',
      description: 'Wireless headphones and portable charger',
      currentBid: 75,
      startingBid: 40,
      image: '🎧',
      status: 'ended',
      endTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      bidCount: 22,
      donor: 'Tech Store',
      category: 'Electronics'
    }
  ];

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'upcoming', label: 'Upcoming' },
    { key: 'ended', label: 'Ended' }
  ];

  const getStatus = (item) => {
    const now = new Date();
    const end = new Date(item.endTime);
    if (now > end) return 'ended';
    if (item.status === 'upcoming') return 'upcoming';
    return 'active';
  };

  const getCountdown = (item) => {
    const now = new Date();
    const end = new Date(item.endTime);
    const diff = end - now;
    if (diff <= 0) return 'Ended';
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h left`;
    if (hours > 0) return `${hours}h ${mins}m left`;
    return `${mins}m left`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'upcoming': return '#3b82f6';
      case 'ended': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const sourceAuctions = auctions.length > 0 ? auctions : exampleAuctions;
  const filteredAuctions = sourceAuctions.filter(auction => {
    if (selectedFilter === 'all') return true;
    return getStatus(auction) === selectedFilter;
  });

  // Normalize backend payload → UI shape
  const normalizeAuction = (a) => ({
    id: a.id,
    name: a.title,
    description: a.description,
    currentBid: a.current_bid ?? a.starting_bid,
    startingBid: a.starting_bid,
    image: '🎗️',
    status: a.status,
    endTime: a.ends_at,
    bidCount: Array.isArray(a.bids) ? a.bids.length : (a.bid_count ?? 0),
    donor: a.owner_username ?? 'Admin',
    category: a.ai_category ?? 'General',
  });

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await auctionService.getAuctions();
        if (!isMounted) return;
        const normalized = Array.isArray(data)
          ? data.map(normalizeAuction)
          : (Array.isArray(data?.results) ? data.results.map(normalizeAuction) : []);
        setAuctions(normalized);
      } catch (e) {
        // Keep fallback data, just show a lightweight note
        setError('Showing demo data (backend not reachable).');
      } finally {
        isMounted = false; // prevent setState after unmount
        setLoading(false);
      }
    };
    load();
    return () => { isMounted = false; };
  }, []);

  const renderAuctionItem = ({ item }) => {
    const status = getStatus(item);
    const countdown = getCountdown(item);
    const statusColor = getStatusColor(status);

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('AuctionDetail', { auction: item })}
        style={styles.auctionCard}
        activeOpacity={0.7}
      >
        <Card style={styles.card}>
          <View style={styles.auctionHeader}>
            <View style={styles.imageContainer}>
              <Text style={styles.auctionImage}>{item.image}</Text>
            </View>
            <View style={styles.auctionInfo}>
              <Text style={styles.auctionName}>{item.name}</Text>
              <Text style={styles.auctionDescription} numberOfLines={2}>
                {item.description}
              </Text>
              <Text style={styles.auctionCategory}>{item.category}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
              <Text style={styles.statusText}>{status.toUpperCase()}</Text>
            </View>
          </View>

          <View style={styles.auctionDetails}>
            <View style={styles.bidInfo}>
              <View style={styles.bidRow}>
                <Text style={styles.bidLabel}>Current Bid:</Text>
                <Text style={styles.bidAmount}>${item.currentBid}</Text>
              </View>
              <View style={styles.bidRow}>
                <Text style={styles.bidLabel}>Starting Bid:</Text>
                <Text style={styles.startingBid}>${item.startingBid}</Text>
              </View>
            </View>

            <View style={styles.auctionMeta}>
              <View style={styles.metaItem}>
                <Text style={styles.metaIcon}>⏰</Text>
                <Text style={styles.metaText}>{countdown}</Text>
              </View>
              <View style={styles.metaItem}>
                <Text style={styles.metaIcon}>👥</Text>
                <Text style={styles.metaText}>{item.bidCount} bids</Text>
              </View>
              <View style={styles.metaItem}>
                <Text style={styles.metaIcon}>👤</Text>
                <Text style={styles.metaText}>{item.donor}</Text>
              </View>
            </View>
          </View>

          {status === 'active' && (
            <PrimaryButton
              title="Place Bid"
              onPress={() => navigation.navigate('AuctionDetail', { auction: item })}
              style={styles.bidButton}
            />
          )}
          {status === 'upcoming' && (
            <PrimaryButton
              title="View Details"
              onPress={() => navigation.navigate('AuctionDetail', { auction: item })}
              style={styles.bidButton}
            />
          )}
          {status === 'ended' && (
            <PrimaryButton
              title="View Results"
              onPress={() => navigation.navigate('AuctionDetail', { auction: item })}
              style={styles.bidButton}
            />
          )}
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Auctions</Text>
        <Text style={styles.description}>
          Support pediatric cancer patients by bidding on donated items
        </Text>
        {!!loading && <Text style={styles.loadingText}>Loading auctions…</Text>}
        {!!error && <Text style={styles.errorText}>{error}</Text>}
      </View>

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

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{filteredAuctions.length}</Text>
          <Text style={styles.statLabel}>Items</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {filteredAuctions.reduce((sum, item) => sum + item.bidCount, 0)}
          </Text>
          <Text style={styles.statLabel}>Total Bids</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            ${filteredAuctions.reduce((sum, item) => sum + item.currentBid, 0)}
          </Text>
          <Text style={styles.statLabel}>Raised</Text>
        </View>
      </View>

      <FlatList
        data={filteredAuctions}
        keyExtractor={item => item.id.toString()}
        renderItem={renderAuctionItem}
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
    marginBottom: 16 
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold',
    color: '#2d3436',
    marginBottom: 8,
  },
  description: { 
    fontSize: 16, 
    color: '#636e72',
    lineHeight: 22,
  },
  loadingText: {
    marginTop: 8,
    color: '#6b7280',
  },
  errorText: {
    marginTop: 6,
    color: '#ef4444',
  },
  filterContainer: {
    marginBottom: 16,
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    minWidth: 80,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d3436',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  auctionCard: {
    marginBottom: 16,
  },
  card: {
    padding: 0,
    overflow: 'hidden',
  },
  auctionHeader: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'flex-start',
  },
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  auctionImage: {
    fontSize: 28,
  },
  auctionInfo: {
    flex: 1,
  },
  auctionName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d3436',
    marginBottom: 4,
  },
  auctionDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 18,
    marginBottom: 4,
  },
  auctionCategory: {
    fontSize: 12,
    color: '#3b82f6',
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  auctionDetails: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  bidInfo: {
    marginBottom: 12,
  },
  bidRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  bidLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  bidAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10b981',
  },
  startingBid: {
    fontSize: 14,
    color: '#6b7280',
  },
  auctionMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#6b7280',
  },
  bidButton: {
    marginHorizontal: 16,
    marginBottom: 16,
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