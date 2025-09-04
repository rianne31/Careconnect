import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, Dimensions } from 'react-native';
import { useSelector } from 'react-redux';
import Hero from '../components/Hero';
import Stories from '../components/Stories';
import DonateCTA from '../components/DonateCTA';
import DonorTiers from '../components/DonorTiers';
import Badges from '../components/Badges';
import Streak from '../components/Streak';
import Recommendations from '../components/Recommendations';
import DonorProfileCard from '../components/DonorProfileCard';
import RecentImpactCard from '../components/RecentImpactCard';
import QuickDonateCard from '../components/QuickDonateCard';
import Card from '../components/ui/Card';
import PrimaryButton from '../components/ui/PrimaryButton';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2; // 2 columns with padding

export default function HomeScreen({ navigation }) {
  const user = useSelector((state) => state.user.user);

  const quickActions = [
    {
      id: 1,
      title: 'Make Donation',
      subtitle: 'Support patients',
      icon: '💝',
      color: '#ef4444',
      onPress: () => navigation.navigate('Donation')
    },
    {
      id: 2,
      title: 'View Auctions',
      subtitle: 'Bid on items',
      icon: '🔨',
      color: '#3b82f6',
      onPress: () => navigation.navigate('AuctionList')
    },
    {
      id: 3,
      title: 'My Impact',
      subtitle: 'See your help',
      icon: '📊',
      color: '#10b981',
      onPress: () => navigation.navigate('ImpactDashboard')
    },
    {
      id: 4,
      title: 'AI Insights',
      subtitle: 'Get recommendations',
      icon: '🤖',
      color: '#8b5cf6',
      onPress: () => navigation.navigate('AIScreen')
    },
    {
      id: 5,
      title: 'My Donations',
      subtitle: 'View history',
      icon: '📋',
      color: '#f59e0b',
      onPress: () => navigation.navigate('DonationHistory')
    },
    {
      id: 6,
      title: 'Leaderboard',
      subtitle: 'Top donors',
      icon: '🏆',
      color: '#ec4899',
      onPress: () => navigation.navigate('Leaderboard')
    },
    {
      id: 7,
      title: 'Blockchain',
      subtitle: 'Crypto donations',
      icon: '⛓️',
      color: '#6366f1',
      onPress: () => navigation.navigate('Blockchain')
    },
    {
      id: 8,
      title: 'All Donations',
      subtitle: 'Browse all',
      icon: '🌍',
      color: '#059669',
      onPress: () => navigation.navigate('AllDonations')
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'donation',
      title: 'Donated $50 to Sarah\'s Treatment',
      time: '2 hours ago',
      amount: '$50',
      status: 'completed'
    },
    {
      id: 2,
      type: 'badge',
      title: 'Earned "First Donor" Badge',
      time: '1 day ago',
      amount: null,
      status: 'earned'
    },
    {
      id: 3,
      type: 'auction',
      title: 'Won auction: Art Supplies',
      time: '3 days ago',
      amount: '$25',
      status: 'won'
    }
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Hero onDonate={() => navigation.navigate('Donation')} onStories={() => console.log('Go to stories')} />
      
      <DonorProfileCard 
        user={user}
        onViewProfile={() => navigation.navigate('DonationHistory')}
        onEditProfile={() => navigation.navigate('DonationHistory')}
      />

      {/* Quick Actions Grid */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.grid}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={[styles.actionCard, { width: cardWidth }]}
              onPress={action.onPress}
              activeOpacity={0.7}
            >
              <View style={[styles.actionIcon, { backgroundColor: action.color }]}>
                <Text style={styles.actionIconText}>{action.icon}</Text>
              </View>
              <Text style={styles.actionTitle}>{action.title}</Text>
              <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      <RecentImpactCard 
        onViewDetails={() => navigation.navigate('ImpactDashboard')}
        onViewAll={() => navigation.navigate('ImpactDashboard')}
      />
      
      <QuickDonateCard 
        onQuickDonate={(amount) => navigation.navigate('Donation')}
        onCustomAmount={() => navigation.navigate('Donation')}
      />

      {/* Recent Activities */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <TouchableOpacity onPress={() => navigation.navigate('DonationHistory')}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        <Card style={styles.activitiesCard}>
          {recentActivities.map((activity) => (
            <TouchableOpacity
              key={activity.id}
              style={styles.activityItem}
              onPress={() => {
                if (activity.type === 'donation') {
                  navigation.navigate('DonationHistory');
                } else if (activity.type === 'auction') {
                  navigation.navigate('AuctionList');
                }
              }}
            >
              <View style={styles.activityContent}>
                <View style={styles.activityIcon}>
                  <Text style={styles.activityEmoji}>
                    {activity.type === 'donation' ? '💝' : 
                     activity.type === 'badge' ? '🏆' : '🔨'}
                  </Text>
                </View>
                <View style={styles.activityText}>
                  <Text style={styles.activityTitle}>{activity.title}</Text>
                  <Text style={styles.activityTime}>{activity.time}</Text>
                </View>
                {activity.amount && (
                  <Text style={[styles.activityAmount, 
                    activity.status === 'won' ? styles.wonAmount : styles.donatedAmount
                  ]}>
                    {activity.amount}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </Card>
      </View>

      <DonorTiers 
        currentTier={user?.tier || 'Bronze'}
        onViewTiers={() => navigation.navigate('Leaderboard')}
      />
      
      <Badges 
        badges={user?.badges || []}
        onViewAllBadges={() => navigation.navigate('Leaderboard')}
      />
      
      <Streak 
        currentStreak={user?.streak || 0}
        onViewStreakHistory={() => navigation.navigate('DonationHistory')}
      />
      
      <Recommendations 
        recommendations={user?.recommendations || []}
        onViewRecommendation={(id) => navigation.navigate('AIScreen')}
      />
      
      <Stories />
      <DonateCTA onDonate={(amt) => navigation.navigate('Donation')} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#f6f7fb' },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d3436',
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  viewAllText: {
    color: '#3b82f6',
    fontSize: 14,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionIconText: {
    fontSize: 24,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2d3436',
    textAlign: 'center',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#636e72',
    textAlign: 'center',
  },
  activitiesCard: {
    padding: 0,
  },
  activityItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
  },
  activityContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityEmoji: {
    fontSize: 20,
  },
  activityText: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2d3436',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#636e72',
  },
  activityAmount: {
    fontSize: 14,
    fontWeight: '600',
  },
  donatedAmount: {
    color: '#10b981',
  },
  wonAmount: {
    color: '#3b82f6',
  },
});