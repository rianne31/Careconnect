import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import DetailsScreen from '../screens/DetailsScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import DonationScreen from '../screens/DonationScreen';
import DonationHistoryScreen from '../screens/DonationHistoryScreen';
import AllDonationsScreen from '../screens/AllDonationsScreen';
import AuctionListScreen from '../screens/AuctionListScreen';
import AuctionDetailScreen from '../screens/AuctionDetailScreen';
import PatientManagementScreen from '../screens/PatientManagementScreen';
import AuctionManagementScreen from '../screens/AuctionManagementScreen';
import LeaderboardScreen from '../screens/LeaderboardScreen';
import ImpactDashboardScreen from '../screens/ImpactDashboardScreen';
import BlockchainScreen from '../screens/BlockchainScreen';
import AIScreen from '../screens/AIScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
        <Stack.Screen name="Donation" component={DonationScreen} />
        <Stack.Screen name="DonationHistory" component={DonationHistoryScreen} />
        <Stack.Screen name="AuctionList" component={AuctionListScreen} />
        <Stack.Screen name="AuctionDetail" component={AuctionDetailScreen} />
        <Stack.Screen name="AllDonations" component={AllDonationsScreen} />
        <Stack.Screen name="PatientManagement" component={PatientManagementScreen} />
        <Stack.Screen name="AuctionManagement" component={AuctionManagementScreen} />
        <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
        <Stack.Screen name="ImpactDashboard" component={ImpactDashboardScreen} />
        <Stack.Screen name="Blockchain" component={BlockchainScreen} />
        <Stack.Screen name="AIScreen" component={AIScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}