import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { useTheme } from 'styled-components/native';

export default function Heading({ children, level = 2, style }) {
  const theme = useTheme();
  const map = { 1: theme.typography.h1, 2: theme.typography.h2, 3: theme.typography.h3 };
  return <Text style={[styles(theme).base, map[level] || map[2], style]}>{children}</Text>;
}

const styles = (theme) =>
  StyleSheet.create({
    base: { color: theme.colors.text },
  });


