import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';
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
import DonorDashboardScreen from '../screens/DonorDashboardScreen';
import BlockchainScreen from '../screens/BlockchainScreen';
import AIScreen from '../screens/AIScreen';
import PatientNeedsScreen from '../screens/PatientNeedsScreen';
import { withAuth } from './withAuth';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const [role, setRole] = useState('guest');

  useEffect(() => {
    const load = async () => {
      try {
        const token = await AsyncStorage.getItem('access_token');
        if (!token) return;
        const decoded = jwt_decode(token);
        const r = decoded.role || (decoded.is_staff ? 'admin' : 'donor');
        setRole(r);
      } catch (_) {}
    };
    load();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="PatientNeeds" component={PatientNeedsScreen} options={{ title: 'Patient Needs' }} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
        <Stack.Screen name="Donation" component={withAuth(DonationScreen, ['donor','admin'])} />
        <Stack.Screen name="DonationHistory" component={withAuth(DonationHistoryScreen, ['donor','admin'])} />
        <Stack.Screen name="AuctionList" component={AuctionListScreen} />
        <Stack.Screen name="AuctionDetail" component={AuctionDetailScreen} />
        <Stack.Screen name="AllDonations" component={withAuth(AllDonationsScreen, ['donor','admin'])} />
        {role === 'admin' && (
          <>
            <Stack.Screen name="PatientManagement" component={withAuth(PatientManagementScreen, ['admin'])} />
            <Stack.Screen name="AuctionManagement" component={withAuth(AuctionManagementScreen, ['admin'])} />
          </>
        )}
        <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
        <Stack.Screen name="ImpactDashboard" component={withAuth(ImpactDashboardScreen, ['donor','admin'])} />
        <Stack.Screen name="DonorDashboard" component={withAuth(DonorDashboardScreen, ['donor','admin'])} />
        <Stack.Screen name="Blockchain" component={BlockchainScreen} />
        <Stack.Screen name="AIScreen" component={AIScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}