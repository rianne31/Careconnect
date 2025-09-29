import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Card from '../components/ui/Card';
import { patientService } from '../services/apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const priorityMeta = {
  Critical: { color: '#ef4444', label: 'Critical Need' },
  High: { color: '#f59e0b', label: 'High Priority' },
  General: { color: '#10b981', label: 'General Support' },
};

export default function PatientNeedsScreen({ route, navigation }) {
  const initialPriority = route?.params?.priority ?? 'All';
  const [priority, setPriority] = useState(initialPriority);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [role, setRole] = useState('guest');

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await patientService.getPatients();
        if (!mounted) return;
        setPatients(Array.isArray(data) ? data : (data?.results ?? []));
      } catch (e) {
        setError('Unable to load patient needs.');
      } finally {
        setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    const loadRole = async () => {
      try {
        const token = await AsyncStorage.getItem('access_token');
        if (!token) return;
        const decoded = JSON.parse(atob(token.split('.')[1]));
        const r = decoded.role || (decoded.is_staff ? 'admin' : 'donor');
        setRole(r);
      } catch (_) {}
    };
    loadRole();
  }, []);

  const filtered = useMemo(() => {
    if (priority === 'All') return patients;
    return patients.filter(p => (p.ai_priority ?? '').toLowerCase().startsWith(priority.toLowerCase()))
  }, [patients, priority]);

  const renderItem = ({ item }) => {
    const meta = priorityMeta[item.ai_priority] || priorityMeta.General;
    return (
      <Card style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={[styles.badge, { backgroundColor: meta.color }]}>{meta.label}</Text>
          <Text style={styles.patientId}>Patient ID: {item.code}</Text>
        </View>
        <Text style={styles.title}>{item.diagnosis || 'Support Needed'}</Text>
        <Text style={styles.desc} numberOfLines={3}>{item.needs}</Text>
        <View style={styles.footerRow}>
          <Text style={styles.meta}>Updated: {new Date(item.last_updated).toLocaleDateString()}</Text>
          <TouchableOpacity style={styles.cta} onPress={() => navigation.navigate('Donation', { patientCode: item.code })}>
            <Text style={styles.ctaText}>Donate Now</Text>
          </TouchableOpacity>
          {role === 'admin' && (
            <TouchableOpacity style={[styles.cta, { backgroundColor: '#3b82f6', marginLeft: 8 }]} onPress={async()=>{
              try {
                await patientService.aiTagPatient(item.id);
                const data = await patientService.getPatients();
                setPatients(Array.isArray(data) ? data : (data?.results ?? []));
              } catch (_) {}
            }}>
              <Text style={styles.ctaText}>Tag with AI</Text>
            </TouchableOpacity>
          )}
        </View>
      </Card>
    );
  };

  const renderSkeleton = () => (
    <Card style={styles.card}>
      <View style={styles.skelHeader}>
        <View style={[styles.skelBadge, { width: 100 }]} />
        <View style={[styles.skelLine, { width: 80 }]} />
      </View>
      <View style={[styles.skelLine, { width: '60%', height: 18, marginTop: 4 }]} />
      <View style={[styles.skelLine, { width: '100%', height: 12, marginTop: 8 }]} />
      <View style={[styles.skelLine, { width: '95%', height: 12, marginTop: 6 }]} />
      <View style={[styles.skelFooter]}>
        <View style={[styles.skelLine, { width: 120 }]} />
        <View style={[styles.skelCta]} />
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titlePage}>Patient Needs Dashboard</Text>
        <Text style={styles.subtitle}>Browse current needs and make a direct impact on a child's life</Text>
        <View style={styles.filters}>
          {['All','Critical','High','General'].map(p => (
            <TouchableOpacity key={p} style={[styles.filterBtn, priority===p && styles.filterActive]} onPress={()=>setPriority(p)}>
              <Text style={[styles.filterText, priority===p && styles.filterActiveText]}>{p}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {!!loading && <Text style={styles.loading}>Loading…</Text>}
        {!!error && <Text style={styles.error}>{error}</Text>}
      </View>
      {loading ? (
        <View style={styles.list}>
          {Array.from({ length: 6 }).map((_, idx) => (
            <View key={idx}>{renderSkeleton()}</View>
          ))}
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(i) => String(i.id ?? i.code)}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6f7fb' },
  header: { padding: 16 },
  titlePage: { fontSize: 24, fontWeight: '800', color: '#111827' },
  subtitle: { color: '#6b7280', marginTop: 6 },
  filters: { flexDirection: 'row', marginTop: 12 },
  filterBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, backgroundColor: '#eef2ff', marginRight: 8 },
  filterActive: { backgroundColor: '#3b82f6' },
  filterText: { color: '#1f2937', fontWeight: '600' },
  filterActiveText: { color: 'white' },
  list: { padding: 16 },
  card: { marginBottom: 12 },
  skelHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  skelBadge: { height: 20, backgroundColor: '#e5e7eb', borderRadius: 8 },
  skelLine: { height: 14, backgroundColor: '#e5e7eb', borderRadius: 8 },
  skelFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  skelCta: { width: 96, height: 32, backgroundColor: '#e5e7eb', borderRadius: 8 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  badge: { color: 'white', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, overflow: 'hidden', fontSize: 12, fontWeight: '700' },
  patientId: { color: '#6b7280', fontSize: 12 },
  title: { fontSize: 16, fontWeight: '700', color: '#111827' },
  desc: { marginTop: 6, color: '#374151' },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  meta: { color: '#6b7280', fontSize: 12 },
  cta: { backgroundColor: '#ef4444', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8 },
  ctaText: { color: 'white', fontWeight: '700' },
  loading: { marginTop: 8, color: '#6b7280' },
  error: { marginTop: 6, color: '#ef4444' },
});


