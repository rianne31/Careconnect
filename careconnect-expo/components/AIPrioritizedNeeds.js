import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AIPrioritizedNeeds({ items = [] }) {
  const needs = items.length ? items : [
    { id: 'n1', title: 'Emergency Surgery Fund', priority: 'High', rationale: 'Urgent timeline and high impact' },
    { id: 'n2', title: 'Rural Clinic Supplies', priority: 'Medium', rationale: 'Broad coverage; moderate urgency' },
    { id: 'n3', title: 'Mental Health Outreach', priority: 'Medium', rationale: 'Longevity and preventive impact' },
  ];

  const priorityColor = (p) => (p === 'High' ? '#d63031' : p === 'Medium' ? '#fdcb6e' : '#00b894');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AI-Prioritized Needs</Text>
      {needs.map((n) => (
        <View key={n.id} style={styles.card}>
          <View style={[styles.pill, { backgroundColor: priorityColor(n.priority) }]}>
            <Text style={styles.pillText}>{n.priority}</Text>
          </View>
          <Text style={styles.itemTitle}>{n.title}</Text>
          <Text style={styles.rationale}>{n.rationale}</Text>
        </View>
      ))}
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
  title: { fontSize: 18, fontWeight: 'bold', color: '#2d3436', marginBottom: 8 },
  card: { backgroundColor: '#f8f9fb', borderRadius: 10, padding: 12, marginBottom: 10 },
  pill: { alignSelf: 'flex-start', borderRadius: 999, paddingVertical: 4, paddingHorizontal: 8, marginBottom: 6 },
  pillText: { color: '#fff', fontWeight: '600', fontSize: 12 },
  itemTitle: { color: '#2d3436', fontWeight: '600' },
  rationale: { color: '#636e72', marginTop: 4 },
});


