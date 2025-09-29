import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';

function getRoleFromToken(token) {
  try {
    const decoded = jwt_decode(token);
    return decoded.role || (decoded.is_staff ? 'admin' : 'donor');
  } catch (_) {
    return 'guest';
  }
}

export function withAuth(ScreenComponent, allowedRoles = ['donor', 'admin']) {
  return function GuardedScreen(props) {
    const { navigation } = props;
    const [checking, setChecking] = useState(true);

    useEffect(() => {
      let mounted = true;
      const verify = async () => {
        try {
          const token = await AsyncStorage.getItem('access_token');
          if (!token) {
            navigation.replace('Login');
            return;
          }
          const role = getRoleFromToken(token);
          if (!allowedRoles.includes(role)) {
            // If authenticated but not authorized, send to Home
            navigation.replace('Home');
            return;
          }
        } finally {
          if (mounted) setChecking(false);
        }
      };
      verify();
      return () => {
        mounted = false;
      };
    }, [navigation]);

    if (checking) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator />
        </View>
      );
    }

    return <ScreenComponent {...props} />;
  };
}


