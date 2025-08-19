import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import AuctionListScreen from '../screens/AuctionListScreen';
import DonationScreen from '../screens/DonationScreen';
import DonationHistoryScreen from '../screens/DonationHistoryScreen';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Auctions" component={AuctionListScreen} />
      <Tab.Screen name="Donate" component={DonationScreen} />
      <Tab.Screen name="My Donations" component={DonationHistoryScreen} />
    </Tab.Navigator>
  );
} 