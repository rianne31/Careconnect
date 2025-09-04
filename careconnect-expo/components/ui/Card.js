import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from 'styled-components/native';

export default function Card({ children, style }) {
  const theme = useTheme();
  return <View style={[styles(theme).card, style]}>{children}</View>;
}

const styles = (theme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radii.md,
      padding: theme.spacing.md,
      shadowColor: theme.shadow.color,
      shadowOpacity: theme.shadow.opacity,
      shadowRadius: theme.shadow.radius,
      shadowOffset: theme.shadow.offset,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.border,
    },
  });


