import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import AuctionListScreen from '../screens/AuctionListScreen';
import DonationScreen from '../screens/DonationScreen';
import DonationHistoryScreen from '../screens/DonationHistoryScreen';
import LeaderboardScreen from '../screens/LeaderboardScreen';
import ImpactDashboardScreen from '../screens/ImpactDashboardScreen';
import BlockchainScreen from '../screens/BlockchainScreen';
import AIScreen from '../screens/AIScreen';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="🏠 Home" component={HomeScreen} />
      <Tab.Screen name="🎯 Auctions" component={AuctionListScreen} />
      <Tab.Screen name="💝 Donate" component={DonationScreen} />
      <Tab.Screen name="📊 My Donations" component={DonationHistoryScreen} />
      <Tab.Screen name="🏆 Leaderboard" component={LeaderboardScreen} />
      <Tab.Screen name="📈 Impact" component={ImpactDashboardScreen} />
      <Tab.Screen name="🔗 Blockchain" component={BlockchainScreen} />
      <Tab.Screen name="🤖 AI" component={AIScreen} />
    </Tab.Navigator>
  );
} 