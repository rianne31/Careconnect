import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';

export default function Hero({ onDonate, onStories }) {
  return (
    <View style={styles.wrapper}>
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1504439468489-c8920d796a29?q=80&w=1600&auto=format&fit=crop' }}
        style={styles.bg}
        imageStyle={styles.bgImage}
        accessible
        accessibilityLabel="Together, we can brighten the journey for children fighting cancer"
      >
        <View style={styles.overlay} />
        <View style={styles.content}>
          <Text style={styles.kicker}>Every gift brings hope</Text>
          <Text style={styles.title}>Together, we can brighten the journey</Text>
          <Text style={styles.subtitle}>Support life-saving treatments and family assistance.</Text>
          <View style={styles.ctaRow}>
            <TouchableOpacity style={styles.btnPrimary} onPress={onDonate} accessibilityRole="button">
              <Text style={styles.btnPrimaryText}>Donate Now</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnSecondary} onPress={onStories} accessibilityRole="button">
              <Text style={styles.btnSecondaryText}>Read Stories</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: 16 },
  bg: { height: 240, justifyContent: 'flex-end' },
  bgImage: { borderRadius: 16 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderRadius: 16,
  },
  content: { padding: 16 },
  kicker: {
    alignSelf: 'flex-start',
    backgroundColor: '#ffe08a',
    color: '#5a4930',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    fontWeight: '600',
    marginBottom: 8,
  },
  title: { color: '#ffffff', fontSize: 24, fontWeight: '800' },
  subtitle: { color: '#eaeef4', marginTop: 4 },
  ctaRow: { flexDirection: 'row', gap: 10, marginTop: 12 },
  btnPrimary: { backgroundColor: '#5aa9e6', borderRadius: 999, paddingVertical: 10, paddingHorizontal: 16 },
  btnPrimaryText: { color: '#ffffff', fontWeight: '700' },
  btnSecondary: { backgroundColor: '#ffffff', borderRadius: 999, paddingVertical: 10, paddingHorizontal: 16 },
  btnSecondaryText: { color: '#1f2a37', fontWeight: '700' },
});


