import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Heading from '../components/ui/Heading';
import Text from '../components/ui/Text';
import Card from '../components/ui/Card';
import AllocationTracker from '../components/AllocationTracker';
import ProgressIndicators from '../components/ProgressIndicators';
import GeoImpact from '../components/GeoImpact';

export default function ImpactDashboardScreen({ navigation }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.hero}>
        <View style={styles.heroTopBar} />
        <View style={styles.heroInner}>
          <Heading level={1}>Impact Dashboard</Heading>
          <Text variant="body">Real-time allocation, goal progress, and geographic reach</Text>
        </View>
      </View>

      <AllocationTracker />
      <ProgressIndicators />
      <GeoImpact />
      
      <TouchableOpacity
        style={styles.backToHomeButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.backToHomeText}>← Back to Home</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#f6f7fb' },
  hero: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    overflow: 'hidden',
  },
  heroTopBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: '#2563eb',
  },
  heroInner: {},
  backToHomeButton: {
    marginTop: 20,
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


