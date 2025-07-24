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
import MainTabNavigator from './MainTabNavigator';
import AuctionDetailScreen from '../screens/AuctionDetailScreen';
import PatientManagementScreen from '../screens/PatientManagementScreen';
import AuctionManagementScreen from '../screens/AuctionManagementScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Main" component={MainTabNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
        <Stack.Screen name="Donation" component={DonationScreen} />
        <Stack.Screen name="DonationHistory" component={DonationHistoryScreen} />
        <Stack.Screen name="AuctionDetail" component={AuctionDetailScreen} />
        <Stack.Screen name="AllDonations" component={AllDonationsScreen} />
        <Stack.Screen name="PatientManagement" component={PatientManagementScreen} />
        <Stack.Screen name="AuctionManagement" component={AuctionManagementScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
} 