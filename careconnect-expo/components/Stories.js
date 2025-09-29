import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const STORIES = [
  {
    id: 's1',
    image:
      'https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=1600&auto=format&fit=crop',
    quote: '“The care package arrived right when we needed it most.”',
    by: '— Maya’s mom',
  },
  {
    id: 's2',
    image:
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1600&auto=format&fit=crop',
    quote: '“Small donations added up to cover our travel to treatment.”',
    by: '— Liam’s dad',
  },
  {
    id: 's3',
    image:
      'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=1600&auto=format&fit=crop',
    quote: '“Knowing we’re not alone gives us strength.”',
    by: '— Ava’s family',
  },
];

export default function Stories() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Patient Stories</Text>
      <Text style={styles.subtitle}>Real moments of courage your support uplifts.</Text>
      <View style={styles.grid}>
        {STORIES.map((s) => (
          <View key={s.id} style={styles.card}>
            <Image source={{ uri: s.image }} style={styles.img} resizeMode="cover" />
            <View style={styles.body}>
              <Text style={styles.quote}>{s.quote}</Text>
              <Text style={styles.by}>{s.by}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    marginBottom: 16,
  },
  title: { fontSize: 18, fontWeight: 'bold', color: '#2d3436' },
  subtitle: { color: '#636e72', marginTop: 4, marginBottom: 8 },
  grid: { gap: 12 },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#e9ecef',
  },
  img: { width: '100%', height: 140 },
  body: { padding: 12 },
  quote: { color: '#3e4a57', fontStyle: 'italic', marginBottom: 4 },
  by: { color: '#636e72' },
});


