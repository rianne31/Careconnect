import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, Dimensions } from 'react-native';
import { useSelector } from 'react-redux';
import { patientService, donationService } from '../services/apiService';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2; // 2 columns with padding

export default function HomeScreen({ navigation }) {
  const user = useSelector((state) => state.user.user);
  const [stats, setStats] = useState({ patients: 0, activeNeeds: 0, donations: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const [patients, donations] = await Promise.all([
          patientService.getPatients().catch(() => []),
          donationService.getDonations().catch(() => []),
        ]);
        if (!mounted) return;
        const active = Array.isArray(patients) ? patients.filter(p => !!p.ai_priority).length : 0;
        setStats({
          patients: Array.isArray(patients) ? patients.length : 0,
          activeNeeds: active,
          donations: Array.isArray(donations) ? donations.length : 0,
        });
      } catch (e) {
        setError('Showing demo counters');
      } finally {
        setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

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
    }
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Hero Section */}
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Welcome to CareConnect</Text>
        <Text style={styles.heroSubtitle}>Together, we can brighten the journey for children fighting cancer</Text>
        <TouchableOpacity 
          style={styles.heroButton}
          onPress={() => navigation.navigate('Donation')}
        >
          <Text style={styles.heroButtonText}>Donate Now</Text>
        </TouchableOpacity>
      </View>

      {/* Stats & Profile */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: '#eef2ff' }]}>
          <Text style={styles.statNumber}>{stats.patients}</Text>
          <Text style={styles.statLabel}>Patients Helped</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#ecfeff' }]}>
          <Text style={styles.statNumber}>{stats.activeNeeds}</Text>
          <Text style={styles.statLabel}>Active Needs</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#ecfdf5' }]}>
          <Text style={styles.statNumber}>{stats.donations}</Text>
          <Text style={styles.statLabel}>Donations Made</Text>
        </View>
      </View>

      <View style={styles.profileCard}>
        <Text style={styles.profileTitle}>Donor Profile</Text>
        <Text style={styles.profileText}>Welcome, {user?.name || 'Guest'}!</Text>
        <Text style={styles.profileText}>Tier: {user?.tier || 'Bronze'}</Text>
        <Text style={styles.profileText}>Streak: {user?.streak || 0} days</Text>
      </View>

      {/* Donation Categories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Donation Categories</Text>
        <View style={styles.grid}>
          <TouchableOpacity style={[styles.categoryCard, { borderColor: '#ef4444' }]} onPress={() => navigation.navigate('PatientNeeds', { priority: 'Critical' })}>
            <Text style={[styles.categoryTitle, { color: '#ef4444' }]}>Critical Needs</Text>
            <Text style={styles.categoryDesc}>Urgent needs within 24–48 hours.</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.categoryCard, { borderColor: '#f59e0b' }]} onPress={() => navigation.navigate('PatientNeeds', { priority: 'High' })}>
            <Text style={[styles.categoryTitle, { color: '#f59e0b' }]}>High Priority</Text>
            <Text style={styles.categoryDesc}>Important needs within a week.</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.categoryCard, { borderColor: '#10b981' }]} onPress={() => navigation.navigate('PatientNeeds', { priority: 'General' })}>
            <Text style={[styles.categoryTitle, { color: '#10b981' }]}>General Support</Text>
            <Text style={styles.categoryDesc}>Ongoing facility and comfort needs.</Text>
          </TouchableOpacity>
        </View>
      </View>

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

      {/* Recent Activity */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityCard}>
          <View style={styles.activityItem}>
            <Text style={styles.activityEmoji}>💝</Text>
            <View style={styles.activityText}>
              <Text style={styles.activityTitle}>Donated $50 to Sarah's Treatment</Text>
              <Text style={styles.activityTime}>2 hours ago</Text>
            </View>
            <Text style={styles.activityAmount}>$50</Text>
          </View>
          <View style={styles.activityItem}>
            <Text style={styles.activityEmoji}>🏆</Text>
            <View style={styles.activityText}>
              <Text style={styles.activityTitle}>Earned "First Donor" Badge</Text>
              <Text style={styles.activityTime}>1 day ago</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Login/Register Section */}
      <View style={styles.authSection}>
        <Text style={styles.sectionTitle}>Get Started</Text>
        <TouchableOpacity 
          style={styles.authButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.authButtonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.authButton, styles.registerButton]}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={[styles.authButtonText, styles.registerButtonText]}>Register</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    padding: 16, 
    backgroundColor: '#f6f7fb',
    minHeight: '100%'
  },
  hero: {
    backgroundColor: '#6c5ce7',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: 20,
  },
  heroButton: {
    backgroundColor: 'white',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  heroButtonText: {
    color: '#6c5ce7',
    fontWeight: 'bold',
    fontSize: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    marginRight: 10,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  statNumber: { fontSize: 20, fontWeight: '800', color: '#1f2937' },
  statLabel: { fontSize: 12, color: '#6b7280' },
  categoryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  categoryTitle: { fontSize: 16, fontWeight: '700' },
  categoryDesc: { color: '#6b7280', marginTop: 6 },
  profileCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  profileTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d3436',
    marginBottom: 8,
  },
  profileText: {
    fontSize: 14,
    color: '#636e72',
    marginBottom: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d3436',
    marginBottom: 12,
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
  activityCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
  },
  activityEmoji: {
    fontSize: 24,
    marginRight: 12,
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
    color: '#10b981',
  },
  authSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  authButton: {
    backgroundColor: '#6c5ce7',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 25,
    marginBottom: 12,
    width: '100%',
    alignItems: 'center',
  },
  authButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  registerButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#6c5ce7',
  },
  registerButtonText: {
    color: '#6c5ce7',
  },
});