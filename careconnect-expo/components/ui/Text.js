import React from 'react';
import { Text as RNText, StyleSheet } from 'react-native';
import { useTheme } from 'styled-components/native';

export default function Text({ children, variant = 'body', style, ...rest }) {
  const theme = useTheme();
  const map = { body: theme.typography.body, small: theme.typography.small };
  return (
    <RNText {...rest} style={[styles(theme).base, map[variant] || map.body, style]}>
      {children}
    </RNText>
  );
}

const styles = (theme) =>
  StyleSheet.create({
    base: { color: theme.colors.text },
  });


