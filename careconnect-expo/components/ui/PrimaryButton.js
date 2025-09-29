import React from 'react';
import { Pressable, Text } from 'react-native';

export default function PrimaryButton({ title, onPress, disabled, className = '', style }) {
  const base = 'rounded-xl bg-primary-600 px-4 py-3 items-center justify-center shadow-sm';
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled}
      className={`${base} ${disabled ? 'opacity-50' : 'active:bg-primary-700'} ${className}`}
      style={style}
    >
      <Text className="text-white font-semibold">{title}</Text>
    </Pressable>
  );
}


