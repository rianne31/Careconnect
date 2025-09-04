import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from 'styled-components/native';

export default function PrimaryButton({ title, onPress, disabled }) {
  const theme = useTheme();
  return (
    <TouchableOpacity
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled}
      style={[styles(theme).btn, disabled && styles(theme).btnDisabled]}
    >
      <Text style={styles(theme).label}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = (theme) =>
  StyleSheet.create({
    btn: {
      backgroundColor: theme.colors.primary,
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.lg,
      borderRadius: theme.radii.pill,
      alignSelf: 'flex-start',
    },
    btnDisabled: { opacity: 0.5 },
    label: { color: '#fff', fontWeight: '600' },
  });


